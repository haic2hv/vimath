-- ============================================================
-- HMath Database Setup Script
-- Chạy SQL này trong Supabase SQL Editor:
-- https://supabase.com/dashboard → Project → SQL Editor → New Query
-- ============================================================

-- BƯỚC 0: Xóa bảng cũ nếu bị lỗi lần trước (an toàn vì chưa có data)
DROP TABLE IF EXISTS "Purchase" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Profile" CASCADE;

-- 1. Bảng Profile (lưu thông tin người dùng)
-- Prisma dùng String → PostgreSQL TEXT cho id
CREATE TABLE "Profile" (
    "id" TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    "userId" TEXT UNIQUE NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT DEFAULT 'user' NOT NULL,
    "tokenBalance" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Bảng Order (lưu lịch sử nạp token và mua nội dung)
CREATE TABLE "Order" (
    "id" TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tokenAmount" INTEGER NOT NULL,
    "status" TEXT DEFAULT 'pending' NOT NULL,
    "sepayRef" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Bảng Purchase (lưu nội dung đã mua)
CREATE TABLE "Purchase" (
    "id" TEXT DEFAULT gen_random_uuid()::text PRIMARY KEY,
    "profileId" TEXT NOT NULL REFERENCES "Profile"("id") ON DELETE CASCADE,
    "itemType" TEXT NOT NULL,
    "itemSlug" TEXT NOT NULL,
    "tokenAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE("profileId", "itemType", "itemSlug")
);

-- ============================================================
-- Enable Row Level Security (RLS)
-- ============================================================

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Purchase" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies cho Profile
-- ============================================================

CREATE POLICY "Users can read own profile" ON "Profile"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own profile" ON "Profile"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own profile" ON "Profile"
    FOR UPDATE USING (auth.uid()::text = "userId");

-- ============================================================
-- RLS Policies cho Order
-- ============================================================

CREATE POLICY "Users can read own orders" ON "Order"
    FOR SELECT USING (
        "profileId" IN (SELECT "id" FROM "Profile" WHERE "userId" = auth.uid()::text)
    );

CREATE POLICY "Users can create orders" ON "Order"
    FOR INSERT WITH CHECK (
        "profileId" IN (SELECT "id" FROM "Profile" WHERE "userId" = auth.uid()::text)
    );

-- ============================================================
-- RLS Policies cho Purchase
-- ============================================================

CREATE POLICY "Users can read own purchases" ON "Purchase"
    FOR SELECT USING (
        "profileId" IN (SELECT "id" FROM "Profile" WHERE "userId" = auth.uid()::text)
    );

-- ============================================================
-- Auto-update updatedAt trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at
    BEFORE UPDATE ON "Profile"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_updated_at
    BEFORE UPDATE ON "Order"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Indexes cho performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_order_profileid ON "Order"("profileId");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_order_sepayref ON "Order"("sepayRef");
CREATE INDEX IF NOT EXISTS idx_purchase_profileid ON "Purchase"("profileId");
CREATE INDEX IF NOT EXISTS idx_purchase_item ON "Purchase"("itemType", "itemSlug");
