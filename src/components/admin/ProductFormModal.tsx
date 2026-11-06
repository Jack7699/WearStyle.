import React, { useState } from 'react';
import { Product, ProductSize, SizeStock } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface ProductFormModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void;
}

const PRESET_IMAGES = [
  { label: 'Black Heavyweight Hoodie', path: '/src/assets/images/product_hoodie_heavyweight_black_1793989033781.jpg' },
  { label: 'Washed Grey Vintage Hoodie', path: '/src/assets/images/product_hoodie_washed_grey_1793989034247.jpg' },
  { label: 'Vintage Black Drop-Tee', path: '/src/assets/images/product_tshirt_vintage_black_1793989034591.jpg' },
  { label: 'Chalk White Heavy Tee', path: '/src/assets/images/product_tshirt_raw_chalk_1793989035213.jpg' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<'hoodies' | 't-shirts'>(
    productToEdit?.category || 'hoodies'
  );
  const [price, setPrice] = useState(productToEdit?.price?.toString() || '449');
  const [comparePrice, setComparePrice] = useState(
    productToEdit?.comparePrice?.toString() || ''
  );
  const [image, setImage] = useState(
    productToEdit?.image || PRESET_IMAGES[0].path
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [fabric, setFabric] = useState(
    productToEdit?.fabric || '450 GSM Heavy French Terry Cotton'
  );
  const [fit, setFit] = useState(productToEdit?.fit || 'Boxy Oversized Fit');
  const [colorsInput, setColorsInput] = useState(
    productToEdit?.colors?.join(', ') || 'Black, Carbon'
  );
  const [isFeatured, setIsFeatured] = useState(productToEdit?.isFeatured ?? true);

  // Size stock matrix
  const defaultSizes: SizeStock[] = [
    { size: 'S', stock: 10 },
    { size: 'M', stock: 15 },
    { size: 'L', stock: 15 },
    { size: 'XL', stock: 8 },
    { size: 'XXL', stock: 4 },
  ];

  const [sizes, setSizes] = useState<SizeStock[]>(
    productToEdit?.sizes || defaultSizes
  );

  const handleStockChange = (sizeName: ProductSize, value: number) => {
    setSizes((prev) =>
      prev.map((s) => (s.size === sizeName ? { ...s, stock: Math.max(0, value) } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price) || 0;
    const parsedCompare = comparePrice ? parseFloat(comparePrice) : undefined;
    const colors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const finalImage = customImageUrl.trim() || image;

    onSave({
      name: name.trim(),
      category,
      price: parsedPrice,
      comparePrice: parsedCompare,
      image: finalImage,
      description: description.trim() || 'Heavyweight premium streetwear garment.',
      fabric: fabric.trim() || '100% Combed Cotton',
      fit: fit.trim() || 'Oversized Streetwear Fit',
      colors: colors.length > 0 ? colors : ['Black'],
      sizes,
      isFeatured,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white font-display mb-1">
          {productToEdit ? 'Edit Product & Inventory' : 'Create New Wearstyle Product'}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Add a new T-shirt or Hoodie to your Moroccan catalog with custom stock levels per size.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[72vh] overflow-y-auto pr-1">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Heavyweight Monolith Hoodie"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'hoodies' | 't-shirts')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="hoodies">Hoodies</option>
                <option value="t-shirts">T-Shirts</option>
              </select>
            </div>
          </div>

          {/* Pricing in MAD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Selling Price (MAD) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="499"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Compare-at Price (MAD)
              </label>
              <input
                type="number"
                min={1}
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                placeholder="599"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Preset Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Select Product Visual
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((preset) => (
                <div
                  key={preset.path}
                  onClick={() => {
                    setImage(preset.path);
                    setCustomImageUrl('');
                  }}
                  className={`p-1.5 rounded border cursor-pointer transition-all ${
                    image === preset.path && !customImageUrl
                      ? 'border-white bg-zinc-800'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={preset.path}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover rounded mb-1"
                  />
                  <div className="text-[10px] text-zinc-300 truncate">{preset.label}</div>
                </div>
              ))}
            </div>

            <input
              type="text"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Or enter custom image URL/path..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-400 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the silhouette, stitching, feel, and details..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Fabric & Fit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Fabric Specifications (GSM & Cotton)
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="450 GSM Heavy French Terry Cotton"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Cut / Fit
              </label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="Boxy Oversized Drop-Shoulder"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Colorways (comma-separated)
            </label>
            <input
              type="text"
              value={colorsInput}
              onChange={(e) => setColorsInput(e.target.value)}
              placeholder="Jet Black, Chalk White, Washed Grey"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Inventory Stock Per Size */}
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg">
            <label className="block text-xs font-bold text-zinc-200 mb-2">
              Inventory Stock Per Size (Units in Morocco Warehouse)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((s) => (
                <div key={s.size} className="text-center">
                  <span className="text-xs font-mono font-bold text-zinc-400 block mb-1">
                    {s.size}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={s.stock}
                    onChange={(e) => handleStockChange(s.size, parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isFeaturedCheck"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-white focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isFeaturedCheck" className="text-xs text-zinc-300 cursor-pointer">
              Pin to Featured Streetwear Drops section
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 rounded-md transition-colors"
            >
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
