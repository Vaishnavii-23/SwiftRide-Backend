import { fetchApi } from "../lib/api";
import { KYCDocument, KYCDocumentType, AdminPendingKYC, KYCDocumentStatus } from "../types";

export const kycService = {
  async uploadDocument(type: KYCDocumentType, file: File): Promise<{ message: string; document: KYCDocument }> {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("document", file);

    return fetchApi("/kyc/upload", {
      method: "POST",
      body: formData,
      // Pass a header marker or override content-type so fetchApi doesn't force JSON
      headers: {
        "Content-Type": "MULTIPART_FORM_DATA_SPECIAL",
      },
    });
  },

  async getMyDocs(): Promise<{ documents: KYCDocument[] }> {
    return fetchApi("/kyc/my-docs", {
      method: "GET",
    });
  },

  async getPendingDocs(): Promise<{ documents: AdminPendingKYC[] }> {
    return fetchApi("/kyc/pending", {
      method: "GET",
    });
  },

  async reviewDocument(
    documentId: string,
    status: KYCDocumentStatus,
    rejectionReason?: string
  ): Promise<{ message: string; document: KYCDocument }> {
    return fetchApi("/kyc/review", {
      method: "POST",
      body: JSON.stringify({ documentId, status, rejectionReason }),
    });
  },
};
