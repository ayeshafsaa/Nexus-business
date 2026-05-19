import React, { useState, useRef } from 'react';
import {
  FileText, Upload, Download, Trash2, Share2, Eye,
  PenTool, CheckCircle, Clock, AlertCircle, X, Plus,
  File, FileSpreadsheet, Presentation, Search,
  ChevronDown, Check, RotateCcw, Shield, Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = 'draft' | 'in-review' | 'signed';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'sheet' | 'ppt' | 'other';
  size: string;
  uploadedAt: string;
  status: DocStatus;
  shared: boolean;
  sharedWith?: string;
  signed?: boolean;
  signedAt?: string;
  uploadedBy: string;
  tags: string[];
  fileUrl?: string; // real object URL for uploaded files
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_DOCS: Document[] = [
  {
    id: 'd1', name: 'Pitch Deck Q1 2025.pdf', type: 'pdf', size: '2.4 MB',
    uploadedAt: '2025-02-15', status: 'signed', shared: true,
    sharedWith: 'Michael Chen', signed: true, signedAt: '2025-02-18',
    uploadedBy: 'You', tags: ['pitch', 'investor'],
  },
  {
    id: 'd2', name: 'Term Sheet - Series A.pdf', type: 'pdf', size: '890 KB',
    uploadedAt: '2025-02-10', status: 'in-review', shared: true,
    sharedWith: 'Sarah Williams', uploadedBy: 'You', tags: ['legal', 'contract'],
  },
  {
    id: 'd3', name: 'Financial Projections 2025.xlsx', type: 'sheet', size: '1.8 MB',
    uploadedAt: '2025-02-05', status: 'draft', shared: false,
    uploadedBy: 'You', tags: ['finance'],
  },
  {
    id: 'd4', name: 'Business Plan v3.docx', type: 'doc', size: '3.2 MB',
    uploadedAt: '2025-01-28', status: 'in-review', shared: true,
    sharedWith: 'Jennifer Lee', uploadedBy: 'You', tags: ['business', 'plan'],
  },
  {
    id: 'd5', name: 'NDA Agreement.pdf', type: 'pdf', size: '420 KB',
    uploadedAt: '2025-01-20', status: 'signed', shared: true,
    sharedWith: 'Alex Park', signed: true, signedAt: '2025-01-22',
    uploadedBy: 'You', tags: ['legal', 'nda'],
  },
  {
    id: 'd6', name: 'Market Research Report.pdf', type: 'pdf', size: '5.1 MB',
    uploadedAt: '2025-01-15', status: 'draft', shared: false,
    uploadedBy: 'You', tags: ['research', 'market'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fileIcon = (type: Document['type'], size = 20) => {
  switch (type) {
    case 'pdf':   return <FileText size={size} className="flex-shrink-0 text-red-500" />;
    case 'sheet': return <FileSpreadsheet size={size} className="flex-shrink-0 text-green-600" />;
    case 'ppt':   return <Presentation size={size} className="flex-shrink-0 text-orange-500" />;
    case 'doc':   return <FileText size={size} className="flex-shrink-0 text-blue-500" />;
    default:      return <File size={size} className="flex-shrink-0 text-gray-500" />;
  }
};

const statusConfig: Record<DocStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft:       { label: 'Draft',     color: 'bg-gray-100 text-gray-600 border-gray-200',     icon: <AlertCircle size={12} /> },
  'in-review': { label: 'In Review', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={12} /> },
  signed:      { label: 'Signed',    color: 'bg-green-50 text-green-700 border-green-200',   icon: <CheckCircle size={12} /> },
};

const guessType = (name: string): Document['type'] => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'pdf';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'sheet';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  return 'other';
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── Signature Pad ────────────────────────────────────────────────────────────

const SignaturePad: React.FC<{
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}> = ({ onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [fontIdx, setFontIdx] = useState(0);

  const fonts = [
    { label: 'Cursive', style: "italic 32px 'Georgia', serif" },
    { label: 'Script',  style: "italic 28px 'Palatino', serif" },
    { label: 'Print',   style: "24px 'Arial', sans-serif" },
  ];

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.preventDefault();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStrokes(true);
    e.preventDefault();
  };

  const stopDraw = () => { drawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const renderTyped = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fonts[fontIdx].style;
    ctx.fillStyle = '#1e1b4b';
    ctx.textAlign = 'center';
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2 + 10);
    setHasStrokes(!!typedName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PenTool size={18} className="text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Add Signature</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {(['draw', 'type'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors
                ${mode === m ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
              {m === 'draw' ? '✏️ Draw' : '⌨️ Type'}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
            <canvas
              ref={canvasRef} width={460} height={160}
              className="w-full cursor-crosshair touch-none"
              onMouseDown={startDraw} onMouseMove={draw}
              onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
            {!hasStrokes && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-300 text-sm italic">
                  {mode === 'draw' ? 'Sign here with your mouse or touch' : 'Type your name and click Apply'}
                </p>
              </div>
            )}
            <div className="absolute bottom-8 left-6 right-6 border-b border-gray-300" />
          </div>

          {mode === 'type' && (
            <div className="space-y-3">
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Type your full name..."
                value={typedName}
                onChange={e => setTypedName(e.target.value)}
              />
              <div className="flex gap-2">
                {fonts.map((f, i) => (
                  <button key={i} onClick={() => setFontIdx(i)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors
                      ${fontIdx === i ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" fullWidth onClick={renderTyped} disabled={!typedName}>
                Apply to signature
              </Button>
            </div>
          )}

          <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
            <Shield size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-600 leading-relaxed">
              By clicking Save, you agree that this signature is legally binding and equivalent to a handwritten signature.
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
            <RotateCcw size={14} /> Clear
          </button>
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(canvasRef.current!.toDataURL('image/png'))}
            disabled={!hasStrokes} leftIcon={<Check size={16} />}>
            Save Signature
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Document Preview Modal ───────────────────────────────────────────────────

const DocPreviewModal: React.FC<{
  doc: Document;
  onClose: () => void;
  onSign: () => void;
  onStatusChange: (status: DocStatus) => void;
  signature: string | null;
}> = ({ doc, onClose, onSign, onStatusChange, signature }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white/30">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {fileIcon(doc.type, 20)}
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{doc.name}</h3>
            <p className="text-xs text-gray-400">{doc.size} · Uploaded {fmtDate(doc.uploadedAt)}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <X size={18} />
        </button>
      </div>

      {/* ── PREVIEW AREA ── */}
      <div className="flex-1 overflow-hidden bg-gray-100 p-4">

        {/* REAL PDF — uploaded by user → show actual pages in iframe */}
        {doc.fileUrl && doc.type === 'pdf' && (
          <iframe
            src={doc.fileUrl}
            className="w-full h-full rounded-xl border border-gray-200 shadow-sm"
            title={doc.name}
            style={{ minHeight: '420px' }}
          />
        )}

        {/* REAL Word/Excel/PPT — uploaded but browser can't render → download prompt */}
        {doc.fileUrl && doc.type !== 'pdf' && (
          <div className="w-full h-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              {fileIcon(doc.type, 28)}
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold">{doc.name}</p>
              <p className="text-gray-400 text-sm mt-1">
                {doc.type === 'sheet' ? 'Excel' : doc.type === 'doc' ? 'Word' : 'PowerPoint'} files
                cannot be previewed directly in the browser.
              </p>
              <p className="text-gray-400 text-sm">Download the file to view its full content.</p>
            </div>
            <a href={doc.fileUrl} download={doc.name}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <Download size={15} /> Download to view
            </a>
          </div>
        )}

        {/* DEMO DOCS (no real file) → show mock layout with note */}
        {!doc.fileUrl && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 h-full overflow-y-auto relative">
            <div className="space-y-4 max-w-xl mx-auto">
              {/* Mock header */}
              <div className="flex items-center justify-between">
                <div className="w-20 h-7 bg-primary-600 rounded-lg" />
                <span className="text-xs font-semibold text-gray-400 tracking-widest">CONFIDENTIAL</span>
              </div>
              <div className="h-px bg-gray-200" />

              {/* Mock title */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-800 rounded w-2/3" style={{ opacity: 0.75 }} />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>

              {/* Mock section 1 */}
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-600 rounded w-1/3" style={{ opacity: 0.6 }} />
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="h-3 bg-gray-200 rounded flex-1" />
                  </div>
                ))}
              </div>

              {/* Mock section 2 */}
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-600 rounded w-1/4" style={{ opacity: 0.6 }} />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>

              {/* Signature section */}
              <div className="pt-8 border-t border-gray-200 mt-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Authorized Signature</p>
                    <div className="h-16 border-b border-gray-300 flex items-end pb-1">
                      {doc.signed && signature
                        ? <img src={signature} alt="Signature" className="h-12 object-contain" />
                        : <span className="text-gray-300 text-xs italic">Not yet signed</span>
                      }
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {doc.signed ? `Signed on ${fmtDate(doc.signedAt!)}` : 'Pending signature'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Date</p>
                    <div className="h-16 border-b border-gray-300 flex items-end pb-1">
                      <p className="text-sm text-gray-700">
                        {doc.signed ? fmtDate(doc.signedAt!) : '___________'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo notice */}
              <p className="text-center text-xs text-gray-400 italic pt-2">
                📄 This is a demo document. Upload a real PDF to see its actual content here.
              </p>
            </div>

            {/* Signed watermark */}
            {doc.status === 'signed' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-green-200 text-6xl font-bold opacity-20 rotate-[-30deg] select-none">
                  SIGNED
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Status:</span>
          {(['draft', 'in-review', 'signed'] as DocStatus[]).map(s => (
            <button key={s} onClick={() => onStatusChange(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                ${doc.status === s
                  ? statusConfig[s].color + ' ring-1 ring-offset-1 ring-current'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {statusConfig[s].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {doc.fileUrl && (
            <a href={doc.fileUrl} download={doc.name}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Download size={15} /> Download
            </a>
          )}
          {!doc.signed
            ? <Button leftIcon={<PenTool size={15} />} onClick={onSign}>Sign Document</Button>
            : <div className="flex items-center gap-1.5 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle size={15} /> Signed
              </div>
          }
        </div>
      </div>
    </div>
  </div>
);

// ─── Upload Zone ──────────────────────────────────────────────────────────────

const UploadZone: React.FC<{ onUpload: (files: FileList) => void }> = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
        ${dragging ? 'border-primary-400 bg-primary-50 scale-[1.01]' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}
    >
      <input ref={inputRef} type="file" multiple
        accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx" className="hidden"
        onChange={e => e.target.files && onUpload(e.target.files)} />
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors
        ${dragging ? 'bg-primary-100' : 'bg-gray-100'}`}>
        <Upload size={22} className={dragging ? 'text-primary-600' : 'text-gray-400'} />
      </div>
      <p className="text-sm font-semibold text-gray-700">
        {dragging ? 'Drop files here!' : 'Drag & drop files or click to browse'}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Supports PDF (with real preview), Word, Excel, PowerPoint
      </p>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const DocumentChamber: React.FC = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Document[]>(INITIAL_DOCS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DocStatus | 'all'>('all');
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [signingDocId, setSigningDocId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = docs.filter(d => {
    const matchSearch = search === '' ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: docs.length,
    signed: docs.filter(d => d.status === 'signed').length,
    inReview: docs.filter(d => d.status === 'in-review').length,
    draft: docs.filter(d => d.status === 'draft').length,
  };

  const handleUpload = (files: FileList) => {
    const newDocs: Document[] = Array.from(files).map(f => ({
      id: 'd' + Date.now() + Math.random(),
      name: f.name,
      type: guessType(f.name),
      size: f.size > 1024 * 1024
        ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
        : `${(f.size / 1024).toFixed(0)} KB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: 'draft' as DocStatus,
      shared: false,
      uploadedBy: user?.name || 'You',
      tags: [],
      fileUrl: URL.createObjectURL(f), // ← stores real file for preview
    }));
    setDocs(prev => [...newDocs, ...prev]);
    setShowUpload(false);
    showToast(`${newDocs.length} file${newDocs.length > 1 ? 's' : ''} uploaded! Click 👁 to preview.`);
  };

  const handleDelete = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    if (previewDoc?.id === id) setPreviewDoc(null);
    showToast('Document deleted.');
  };

  const handleStatusChange = (id: string, status: DocStatus) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (previewDoc?.id === id) setPreviewDoc(prev => prev ? { ...prev, status } : prev);
    showToast(`Status changed to ${statusConfig[status].label}`);
  };

  const handleSign = (docId: string, sigDataUrl: string) => {
    setSignature(sigDataUrl);
    const today = new Date().toISOString().slice(0, 10);
    setDocs(prev => prev.map(d =>
      d.id === docId ? { ...d, signed: true, signedAt: today, status: 'signed' } : d
    ));
    if (previewDoc?.id === docId) {
      setPreviewDoc(prev => prev ? { ...prev, signed: true, signedAt: today, status: 'signed' } : prev);
    }
    setSigningDocId(null);
    showToast('Document signed successfully!');
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl animate-fade-in">
          <Check size={15} className="text-green-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-500 text-sm mt-0.5">Upload, preview, and sign your deals and contracts</p>
        </div>
        <Button variant="outline" leftIcon={<Upload size={16} />} onClick={() => setShowUpload(v => !v)}>
          Upload
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Documents', value: stats.total,    color: 'bg-primary-50 border-primary-100 text-primary-700' },
          { label: 'Signed',          value: stats.signed,   color: 'bg-green-50 border-green-100 text-green-700' },
          { label: 'In Review',       value: stats.inReview, color: 'bg-yellow-50 border-yellow-100 text-yellow-700' },
          { label: 'Draft',           value: stats.draft,    color: 'bg-gray-50 border-gray-200 text-gray-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div className="animate-fade-in">
          <UploadZone onUpload={handleUpload} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent"
            placeholder="Search documents or tags..."
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'draft', 'in-review', 'signed'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                ${filterStatus === s
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {s === 'all' ? 'All' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.length > 0 ? filtered.map(doc => (
          <div key={doc.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-primary-200 hover:shadow-sm transition-all group">

            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
              {fileIcon(doc.type, 20)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[doc.status].color}`}>
                  {statusConfig[doc.status].icon} {statusConfig[doc.status].label}
                </span>
                {doc.signed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                    <Lock size={10} /> Signed
                  </span>
                )}
                {doc.fileUrl && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                    👁 Previewable
                  </span>
                )}
                {doc.shared && (
                  <span className="text-xs text-gray-400">· Shared with {doc.sharedWith}</span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                <span>{doc.size}</span>
                <span>·</span>
                <span>Uploaded {fmtDate(doc.uploadedAt)}</span>
                {doc.tags.length > 0 && (
                  <>
                    <span>·</span>
                    {doc.tags.map(t => (
                      <span key={t} className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">#{t}</span>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Action buttons — visible on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

              {/* Status dropdown */}
              <div className="relative group/status">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden hidden group-hover/status:block w-32">
                  {(['draft', 'in-review', 'signed'] as DocStatus[]).map(s => (
                    <button key={s} onClick={() => handleStatusChange(doc.id, s)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-50 transition-colors
                        ${doc.status === s ? 'text-primary-600 font-medium' : 'text-gray-700'}`}>
                      {doc.status === s && <Check size={11} />}
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setPreviewDoc(doc)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={doc.fileUrl ? 'Preview real file' : 'Preview mock'}>
                <Eye size={16} />
              </button>

              {!doc.signed && (
                <button onClick={() => setSigningDocId(doc.id)}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Sign document">
                  <PenTool size={16} />
                </button>
              )}

              {doc.fileUrl ? (
                <a href={doc.fileUrl} download={doc.name}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download">
                  <Download size={16} />
                </a>
              ) : (
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                  <Download size={16} />
                </button>
              )}

              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Share">
                <Share2 size={16} />
              </button>

              <button onClick={() => handleDelete(doc.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No documents found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or upload a new document</p>
            <button onClick={() => setShowUpload(true)}
              className="mt-4 flex items-center gap-2 mx-auto text-sm text-primary-600 hover:text-primary-700 font-medium">
              <Plus size={16} /> Upload document
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <DocPreviewModal
          doc={previewDoc}
          onClose={() => setPreviewDoc(null)}
          onSign={() => { setSigningDocId(previewDoc.id); setPreviewDoc(null); }}
          onStatusChange={s => handleStatusChange(previewDoc.id, s)}
          signature={signature}
        />
      )}

      {/* Signature Pad Modal */}
      {signingDocId && (
        <SignaturePad
          onClose={() => setSigningDocId(null)}
          onSave={sig => handleSign(signingDocId, sig)}
        />
      )}
    </div>
  );
};