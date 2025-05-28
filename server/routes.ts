import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertAssetSchema,
  insertLendingPoolSchema,
  insertBorrowingMarketSchema,
  insertLiquidityPoolSchema,
  insertUserPositionSchema,
  insertTransactionSchema,
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";
import { liquidationEngine } from "./liquidation-engine";
import { createTestLiquidationScenarios, simulatePriceVolatility, getLiquidationSystemStatus } from "./test-liquidation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Authentication API (backup routes)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          walletAddress: user.walletAddress 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid login data", 
          errors: error.errors 
        });
      }
      
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        role: "user" // Default role for new users
      });
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role,
          walletAddress: user.walletAddress 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid registration data", 
          errors: error.errors 
        });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.get("/api/admin/all-transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Get all transactions error:", error);
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  // Assets API
  app.get("/api/assets", async (req, res) => {
    const assets = await storage.getAllAssets();
    res.json(assets);
  });

  app.get("/api/assets/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const asset = await storage.getAssetBySymbol(symbol);
    
    if (!asset) {
      return res.status(404).json({ message: `Asset ${symbol} not found` });
    }
    
    res.json(asset);
  });

  // Lending Pools API
  app.get("/api/lending-pools", async (req, res) => {
    const lendingPools = await storage.getAllLendingPools();
    res.json(lendingPools);
  });

  // Borrowing Markets API
  app.get("/api/borrowing-markets", async (req, res) => {
    const borrowingMarkets = await storage.getAllBorrowingMarkets();
    res.json(borrowingMarkets);
  });

  // Liquidity Pools API
  app.get("/api/liquidity-pools", async (req, res) => {
    const liquidityPools = await storage.getAllLiquidityPools();
    res.json(liquidityPools);
  });

  // User Positions API
  app.get("/api/user-positions", async (req, res) => {
    const userAddress = req.query.address as string;
    
    if (!userAddress) {
      return res.status(400).json({ message: "Wallet address required" });
    }
    
    const user = await storage.getUserByWalletAddress(userAddress);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const positions = await storage.getUserPositions(user.id);
    res.json(positions);
  });

  // Transactions API
  app.get("/api/transactions", async (req, res) => {
    const userAddress = req.query.address as string;
    
    if (!userAddress) {
      return res.status(400).json({ message: "Wallet address required" });
    }
    
    const user = await storage.getUserByWalletAddress(userAddress);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const transactions = await storage.getUserTransactions(user.id);
    res.json(transactions);
  });

  // Create a transaction (lend, borrow, swap, etc.)
  app.post("/api/transactions", async (req, res) => {
    try {
      const userAddress = req.body.walletAddress;
      
      if (!userAddress) {
        return res.status(400).json({ message: "Wallet address required" });
      }
      
      let user = await storage.getUserByWalletAddress(userAddress);
      
      // Create user if not exists
      if (!user) {
        user = await storage.createUser({
          username: userAddress,
          password: "placeholder", // In a real app, would never do this
          walletAddress: userAddress
        });
      }
      
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Handle position creation/update based on transaction type
      if (["lend", "borrow"].includes(transaction.type)) {
        await storage.createOrUpdateUserPosition(
          user.id,
          transaction.type === "lend" ? "lending" : "borrowing",
          transaction.assetId,
          transaction.amount,
          transaction.fromAssetId, // as collateralAssetId
          req.body.collateralAmount
        );
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid transaction data", 
          errors: error.errors 
        });
      }
      
      console.error("Transaction error:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Liquidation Engine API Routes
  app.get("/api/liquidation/stats", async (req, res) => {
    try {
      const stats = liquidationEngine.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Get liquidation stats error:", error);
      res.status(500).json({ message: "Failed to get liquidation stats" });
    }
  });

  app.get("/api/liquidation/events", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const events = liquidationEngine.getRecentEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Get liquidation events error:", error);
      res.status(500).json({ message: "Failed to get liquidation events" });
    }
  });

  app.post("/api/liquidation/start", async (req, res) => {
    try {
      liquidationEngine.start();
      res.json({ message: "Liquidation engine started successfully", isRunning: true });
    } catch (error) {
      console.error("Start liquidation engine error:", error);
      res.status(500).json({ message: "Failed to start liquidation engine" });
    }
  });

  app.post("/api/liquidation/stop", async (req, res) => {
    try {
      liquidationEngine.stop();
      res.json({ message: "Liquidation engine stopped successfully", isRunning: false });
    } catch (error) {
      console.error("Stop liquidation engine error:", error);
      res.status(500).json({ message: "Failed to stop liquidation engine" });
    }
  });

  app.post("/api/liquidation/trigger/:positionId", async (req, res) => {
    try {
      const positionId = parseInt(req.params.positionId);
      const result = await liquidationEngine.triggerManualLiquidation(positionId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Manual liquidation error:", error);
      res.status(500).json({ message: "Failed to trigger manual liquidation" });
    }
  });

  app.post("/api/liquidation/config", async (req, res) => {
    try {
      const { liquidationThreshold, liquidationPenalty, healthFactorThreshold } = req.body;
      
      liquidationEngine.updateConfig({
        liquidationThreshold: liquidationThreshold || undefined,
        liquidationPenalty: liquidationPenalty || undefined,
        healthFactorThreshold: healthFactorThreshold || undefined
      });
      
      res.json({ message: "Liquidation configuration updated successfully" });
    } catch (error) {
      console.error("Update liquidation config error:", error);
      res.status(500).json({ message: "Failed to update liquidation configuration" });
    }
  });

  // Liquidation Testing & Management Routes
  app.post("/api/liquidation/test/create-scenarios", async (req, res) => {
    try {
      const result = await createTestLiquidationScenarios();
      res.json({ 
        message: "Test liquidation scenarios created successfully",
        scenarios: result.scenarios,
        testUsers: [result.testUser1.id, result.testUser2.id]
      });
    } catch (error) {
      console.error("Create test scenarios error:", error);
      res.status(500).json({ message: "Failed to create test scenarios" });
    }
  });

  app.post("/api/liquidation/test/simulate-volatility", async (req, res) => {
    try {
      await simulatePriceVolatility();
      res.json({ message: "Market volatility simulated - check positions for liquidation triggers" });
    } catch (error) {
      console.error("Simulate volatility error:", error);
      res.status(500).json({ message: "Failed to simulate market volatility" });
    }
  });

  app.get("/api/liquidation/system-status", async (req, res) => {
    try {
      const status = getLiquidationSystemStatus();
      res.json(status);
    } catch (error) {
      console.error("Get system status error:", error);
      res.status(500).json({ message: "Failed to get liquidation system status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
