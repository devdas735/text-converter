export default function FileUploadBox({ label = 'Upload file', helper = 'Supported: .txt, .docx, .pdf', ...props }) {
  return (
    <label className="group block rounded-2xl border-2 border-dashed border-white/20 bg-gradient-to-br from-white/5 to-brand-500/5 p-8 text-center transition duration-300 hover:border-brand-500/70 hover:from-brand-500/10 hover:to-sky-500/10">
      <span className="block text-sm font-semibold text-slate-100">{label}</span>
      <span className="mt-1 block text-xs text-slate-400">{helper}</span>
      <input className="mt-5 w-full text-xs text-slate-400" type="file" {...props} />
    </label>
  );
}
