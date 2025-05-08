import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAssetSchema,
  insertLendingPoolSchema,
  insertBorrowingMarketSchema,
  insertLiquidityPoolSchema,
  insertUserPositionSchema,
  insertTransactionSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}


  // Auth routes
  app.post("/api/auth", async (req, res) => {
    const { email, password, isLogin } = req.body;
    
    try {
      if (isLogin) {
        const user = await storage.getUserByEmail(email);
        if (!user || user.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ user });
      } else {
        const user = await storage.createUser({
          username: email,
          password,
          walletAddress: ""
        });
        res.json({ user });
      }
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
