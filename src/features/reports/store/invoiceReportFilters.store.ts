import { create } from "zustand";
import type { ReportDateField } from "../models/invoiceReport";

type ReportFilters = { from: string; to: string; dateField: ReportDateField };

type State = {
    filters: ReportFilters;
    setFrom: (v: string) => void;
    setTo: (v: string) => void;
    setDateField: (v: ReportDateField) => void;
};

export const useInvoiceReportFiltersStore = create<State>((set) => ({
    filters: { from: "2026-01-01", to: "2026-01-31", dateField: "paidAt" },
    setFrom: (from) => set((s) => ({ filters: { ...s.filters, from } })),
    setTo: (to) => set((s) => ({ filters: { ...s.filters, to } })),
    setDateField: (dateField) => set((s) => ({ filters: { ...s.filters, dateField } })),
}));
