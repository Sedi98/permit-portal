export interface DocumentType {
  id: number;
  name: string;
}

export interface DocumentTypesResponse {
  status?: string;
  data: DocumentType[];
}

export interface DocumentTypeResponse {
  status?: string;
  message?: string;
  data: DocumentType;
}

export interface CreateDocumentTypePayload {
  name: string;
}
