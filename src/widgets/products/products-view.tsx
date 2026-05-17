"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Modal } from "@/shared/ui/modal";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { useAppStore } from "@/store/use-app-store";
import { useWorkspaceStore } from "@/store/use-workspace-store";

const tone: Record<Product["status"], "success" | "warning" | "danger"> = {
  "In stock": "success",
  "Low stock": "warning",
  Backorder: "danger",
};

export function ProductsView() {
  const pushToast = useAppStore((state) => state.pushToast);
  const products = useWorkspaceStore((state) => state.products);
  const upsertProduct = useWorkspaceStore((state) => state.upsertProduct);
  const [selected, setSelected] = useState<Product | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({
    name: "Compass Revenue",
    category: "Analytics",
    price: 229,
    stock: 64,
  });

  function openEditor(product?: Product) {
    if (product) {
      setEditing(product);
      setEditorOpen(true);
      setForm({ name: product.name, category: product.category, price: product.price, stock: product.stock });
    } else {
      setEditing(null);
      setEditorOpen(true);
      setForm({ name: "Compass Revenue", category: "Analytics", price: 229, stock: 64 });
    }
  }

  function saveProduct(event: React.FormEvent) {
    event.preventDefault();
    const next: Product = {
      id: editing?.id ?? `prd_${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      sold: editing?.sold ?? 0,
      rating: editing?.rating ?? 4.8,
      image: editing?.image ?? "linear-gradient(135deg, #172033, #10d7c4)",
      status: Number(form.stock) === 0 ? "Backorder" : Number(form.stock) < 50 ? "Low stock" : "In stock",
    };
    upsertProduct(next);
    setEditing(null);
    setEditorOpen(false);
    setSelected(null);
    pushToast({
      title: editing ? "Product updated" : "Product created",
      message: `${next.name} is now reflected in the local catalog.`,
      tone: "success",
    });
  }

  return (
    <div className="grid gap-5 pb-20 lg:pb-0">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="brand">Catalog</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-foreground/55">Premium product cards with inventory tracking, status signals, and hover depth.</p>
        </div>
        <Button onClick={() => openEditor()}><Plus className="size-4" /> Add product</Button>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
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
            <Button className="mt-5" variant="secondary" onClick={() => { setSelected(null); openEditor(selected); }}>
              <Pencil className="size-4" /> Edit product
            </Button>
          </div>
        ) : null}
      </Modal>
      <Modal open={editorOpen} title={editing ? "Edit product" : "Create product"} onClose={() => setEditorOpen(false)}>
        <form onSubmit={saveProduct} className="grid gap-4">
          <Input label="Product name" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} />
          <Select label="Category" value={form.category} onChange={(event) => setForm((value) => ({ ...value, category: event.target.value }))}>
            <option>Analytics</option>
            <option>Automation</option>
            <option>Finance</option>
            <option>Security</option>
            <option>Collaboration</option>
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Price" type="number" value={form.price} onChange={(event) => setForm((value) => ({ ...value, price: Number(event.target.value) }))} />
            <Input label="Stock" type="number" value={form.stock} onChange={(event) => setForm((value) => ({ ...value, stock: Number(event.target.value) }))} />
          </div>
          <Button type="submit">{editing ? "Save product" : "Create product"}</Button>
        </form>
      </Modal>
    </div>
  );
}
