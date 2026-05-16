"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Boxes, Star } from "lucide-react";
import { fetchProducts } from "@/mock/api";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Modal } from "@/shared/ui/modal";
import { CardSkeleton } from "@/shared/ui/skeleton";
import { useFakeQuery } from "@/hooks/use-fake-query";

const tone: Record<Product["status"], "success" | "warning" | "danger"> = {
  "In stock": "success",
  "Low stock": "warning",
  Backorder: "danger",
};

export function ProductsView() {
  const query = useCallback(() => fetchProducts(), []);
  const { data, loading } = useFakeQuery(query);
  const [selected, setSelected] = useState<Product | null>(null);

  if (loading) return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}</div>;

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="brand">Catalog</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-foreground/55">Premium product cards with inventory tracking, status signals, and hover depth.</p>
        </div>
        <Button><Boxes className="size-4" /> Add product</Button>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data ?? []).map((product, index) => (
          <motion.button
            type="button"
            key={product.id}
            onClick={() => setSelected(product)}
            className="text-left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full overflow-hidden transition hover:bg-white/[0.08]">
              <div className="mb-5 h-36 rounded-lg border border-white/10" style={{ background: product.image }} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="mt-1 text-sm text-foreground/45">{product.category}</p>
                </div>
                <Badge tone={tone[product.status]}>{product.status}</Badge>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-foreground/40">Price</p><p className="mt-1 font-semibold">{formatCurrency(product.price)}</p></div>
                <div><p className="text-foreground/40">Stock</p><p className="mt-1 font-semibold">{product.stock}</p></div>
                <div><p className="text-foreground/40">Sold</p><p className="mt-1 font-semibold">{product.sold}</p></div>
              </div>
              <div className="mt-5 h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" style={{ width: `${Math.min(100, product.stock)}%` }} />
              </div>
            </Card>
          </motion.button>
        ))}
      </section>
      <Modal open={Boolean(selected)} title="Product preview" onClose={() => setSelected(null)}>
        {selected ? (
          <div>
            <div className="h-52 rounded-xl border border-white/10" style={{ background: selected.image }} />
            <div className="mt-5 flex items-start justify-between">
              <div><h3 className="text-2xl font-semibold">{selected.name}</h3><p className="mt-1 text-sm text-foreground/45">{selected.category}</p></div>
              <Badge tone={tone[selected.status]}>{selected.status}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Price", formatCurrency(selected.price)],
                ["Stock", selected.stock],
                ["Sold", selected.sold],
                ["Rating", selected.rating],
              ].map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 bg-white/[0.05] p-3"><p className="text-xs text-foreground/40">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}
            </div>
            <div className="mt-5 flex items-center gap-1 text-amber-300"><Star className="size-4 fill-current" /> Premium customer satisfaction signal</div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
