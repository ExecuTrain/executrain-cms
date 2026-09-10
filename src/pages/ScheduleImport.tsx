import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Download,
  FileSpreadsheet,
  GraduationCap,
  BookOpen,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileWarning,
} from "lucide-react";
import dayjs from "dayjs";

import Notification from "@/components/Notification";
import {
  useScheduleImportPreview,
  useScheduleImportConfirm,
  useScheduleTemplateDownload,
} from "@/hooks/useSchedule";

type EntityType = "COURSE" | "SKILL_ACCELERATOR";

const fmtDate = (d: string) => dayjs(d).format("DD MMM YYYY");

export default function ScheduleImportPage() {
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null); // hasil import preview
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: downloadTemplate, isPending: downloading } =
    useScheduleTemplateDownload();
  const { mutate: previewFile, isPending: previewing } =
    useScheduleImportPreview();
  const { mutate: confirmImport, isPending: confirming } =
    useScheduleImportConfirm();

  const typeLabel = (t: EntityType) =>
    t === "COURSE" ? "Course Catalog" : "Skill Accelerator";

  const resetFile = () => {
    setFileName("");
    setFileData(null);
    setPreview(null);
    setCheckedRows(new Set());
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDownloadTemplate = (t: EntityType) => {
    downloadTemplate(t, {
      onSuccess: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Schedule_Template_${t === "COURSE" ? "Course" : "Skill_Accelerator"}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        Notification("success", "Template downloaded");
      },
      onError: () => Notification("error", "Failed to download template"),
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.(xlsx|xlsm)$/i.test(f.name)) {
      Notification("error", "Please choose a .xlsx file");
      return;
    }
    setFileName(f.name);
    setFileData(f);
    setPreview(null);
    setCheckedRows(new Set());
  };

  const handlePreview = () => {
    if (!selectedType || !fileData) {
      Notification("error", "Select program type & choose file first");
      return;
    }
    previewFile(
      { type: selectedType, file: fileData },
      {
        onSuccess: (data) => {
          setPreview(data);
          // Default centang semua baris valid (kecuali yang duplikat penuh)
          const check = new Set<number>();
          (data?.rows ?? []).forEach((r: any) => {
            if (!r.has_duplicate) check.add(r.rowNum);
          });
          setCheckedRows(check);
        },
        onError: (e: any) =>
          Notification("error", e?.message || "Failed to preview"),
      },
    );
  };

  const toggleRow = (rowNum: number) => {
    setCheckedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowNum)) next.delete(rowNum);
      else next.add(rowNum);
      return next;
    });
  };

  const selectedRows = (preview?.rows ?? []).filter((r: any) =>
    checkedRows.has(r.rowNum),
  );

  const handleConfirm = () => {
    if (selectedRows.length === 0) {
      Notification("error", "No valid row selected");
      return;
    }
    // Kirim baris yang dicentang (tanpa field duplikat — backend hitung ulang)
    const payload = selectedRows.map(
      ({
        rowNum,
        entity_type,
        entity_id,
        program_name,
        program,
        start_date,
        end_date,
      }: any) => ({
        rowNum,
        entity_type,
        entity_id,
        program_name: program_name || program,
        start_date,
        end_date,
      }),
    );
    confirmImport(payload, {
      onSuccess: (data) => {
        Notification(
          "success",
          `Imported ${data.inserted} of ${data.total_sessions} session(s)`,
        );
        resetFile();
        setSelectedType(null);
      },
      onError: () => Notification("error", "Failed to save schedule"),
    });
  };

  const summary = preview?.summary;
  const hasErrors = (preview?.errors?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/schedule"
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to list
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            Bulk Import Schedule
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Upload an Excel file of class date ranges — preview first, then save
            after confirmation
          </p>
        </div>
      </div>

      {/* Step 1: Pilih type & download template */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h2 className="text-sm font-semibold text-gray-900">
            Choose program type & download template
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {(["COURSE", "SKILL_ACCELERATOR"] as EntityType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setSelectedType(t);
                resetFile();
              }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                selectedType === t
                  ? "border-primary-500 bg-primary-50/60"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t === "COURSE"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-violet-50 text-violet-600"
                }`}
              >
                {t === "COURSE" ? (
                  <GraduationCap className="w-5 h-5" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {typeLabel(t)}
                </p>
                <p className="text-[11px] text-gray-500">
                  Template berisi dropdown program yang valid
                </p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedType === t
                    ? "border-primary-600 bg-primary-600"
                    : "border-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => selectedType && handleDownloadTemplate(selectedType)}
          disabled={!selectedType || downloading}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Downloading..." : "Download Template"}
        </button>
        {selectedType && (
          <p className="text-[11px] text-gray-400 mt-2">
            Template berisi sheet <b>Template</b> (kolom PROGRAM berupa dropdown
            master {typeLabel(selectedType)}) dan sheet <b>MasterData</b>{" "}
            (referensi program). Isi satu baris = satu rentang tanggal (START
            DATE – END DATE, format YYYY-MM-DD).
          </p>
        )}
      </div>

      {/* Step 2: Upload file */}
      <div
        className={`bg-white rounded-2xl border p-5 ${
          preview ? "border-gray-200" : "border-dashed border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-semibold text-gray-900">
            Upload the filled Excel file
          </h2>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f && /\.(xlsx|xlsm)$/i.test(f.name)) {
              setFileName(f.name);
              setFileData(f);
              setPreview(null);
            } else if (f) {
              Notification("error", "Please choose a .xlsx file");
            }
          }}
          className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
            fileData
              ? "border-emerald-400 bg-emerald-50/40"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xlsm"
            className="hidden"
            onChange={onFileChange}
          />
          {fileData ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {fileName}
                </p>
                <p className="text-[11px] text-gray-500">
                  Click or drop another file to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to choose or drag & drop your Excel file here
              </p>
              <p className="text-[11px] text-gray-400">Supported: .xlsx</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!fileData || !selectedType || previewing}
            className="flex items-center gap-1.5 px-5 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {previewing ? "Validating..." : "Validate & Preview"}
            <ArrowRight className="w-4 h-4" />
          </button>
          {fileData && (
            <button
              type="button"
              onClick={resetFile}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Step 3: Hasil preview & konfirmasi */}
      {preview && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-semibold text-gray-900">
              Review before saving
            </h2>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">
                {summary?.total_rows ?? 0}
              </p>
              <p className="text-[11px] text-gray-600">Valid row(s)</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">
                {summary?.total_sessions ?? 0}
              </p>
              <p className="text-[11px] text-gray-600">Total session(s)</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-amber-600">
                {summary?.duplicate_sessions ?? 0}
              </p>
              <p className="text-[11px] text-gray-600">Existing (skipped)</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-red-600">
                {summary?.total_errors ?? 0}
              </p>
              <p className="text-[11px] text-gray-600">Error row(s)</p>
            </div>
          </div>

          {/* Rows valid */}
          {(preview?.rows?.length ?? 0) > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-semibold text-gray-700">
                  Detected valid rows — tick to include
                </p>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-semibold text-gray-600 w-8"></th>
                      <th className="px-3 py-2 font-semibold text-gray-600">
                        #
                      </th>
                      <th className="px-3 py-2 font-semibold text-gray-600">
                        Program
                      </th>
                      <th className="px-3 py-2 font-semibold text-gray-600">
                        Category
                      </th>
                      <th className="px-3 py-2 font-semibold text-gray-600">
                        Date range
                      </th>
                      <th className="px-3 py-2 font-semibold text-gray-600 text-right">
                        Sessions
                      </th>
                      <th className="px-3 py-2 font-semibold text-gray-600 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(preview?.rows ?? []).map((r: any) => {
                      const hasDup = r.has_duplicate;
                      const checked = checkedRows.has(r.rowNum);
                      const showCheck = !hasDup;
                      return (
                        <tr
                          key={r.rowNum}
                          className={checked ? "bg-emerald-50/40" : "bg-white"}
                        >
                          <td className="px-3 py-2">
                            {showCheck ? (
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleRow(r.rowNum)}
                                className="accent-primary-600 w-4 h-4"
                              />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-400">
                            {r.rowNum}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-800 max-w-[240px] truncate">
                            {r.program}
                          </td>
                          <td className="px-3 py-2 text-gray-500">
                            {r.category}
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {fmtDate(r.start_date)} – {fmtDate(r.end_date)}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-700">
                            {r.total_sessions}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {hasDup ? (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full whitespace-nowrap">
                                <AlertTriangle className="w-3 h-3" />
                                {r.duplicate_dates?.length} already exist
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3" />
                                New
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Rows whose dates already exist are skipped (marked amber) and
                cannot be re-checked.
              </p>
            </div>
          )}

          {/* Errors */}
          {hasErrors && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs font-semibold text-gray-700">
                  Rows with errors — not included
                </p>
              </div>
              <div className="bg-red-50/60 border border-red-100 rounded-xl p-3">
                {(preview?.errors ?? []).map((e: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-xs text-red-700 py-0.5"
                  >
                    <FileWarning className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      <b>Row {e.rowNum || "-"}:</b> {e.message}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Perbaiki baris bermasalah di Excel lalu upload ulang.
              </p>
            </div>
          )}

          {/* Confirm */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              {selectedRows.length > 0 ? (
                <span>
                  Will save{" "}
                  <b className="text-gray-800">{selectedRows.length}</b> row(s)
                  /{" "}
                  <b className="text-gray-800">
                    {selectedRows.reduce(
                      (n: number, r: any) => n + r.total_sessions,
                      0,
                    )}
                  </b>{" "}
                  session(s)
                </span>
              ) : (
                <span>No valid row selected to save</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirming || selectedRows.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {confirming ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
