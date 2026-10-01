export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  description: string;
  deadline?: string;
  attachmentName?: string;
  consent: boolean;
};

type LeadService = {
  createLead: (payload: LeadPayload) => Promise<unknown> | unknown;
};

type MileniumWindow = Window & {
  mileniumLeadService?: LeadService;
};

const STORAGE_KEY = 'milenium-site-leads';

/**
 * Uses an injected application service when the host provides one. The
 * public site remains usable in isolation by keeping a local, browser-only
 * fallback for the quote request.
 */
export async function createLead(payload: LeadPayload) {
  const service = (globalThis as unknown as MileniumWindow).mileniumLeadService;

  if (service?.createLead) {
    return service.createLead(payload);
  }

  if (typeof window !== 'undefined') {
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as LeadPayload[];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, { ...payload, createdAt: new Date().toISOString() }]));
  }

  return { source: 'local-fallback' };
}
