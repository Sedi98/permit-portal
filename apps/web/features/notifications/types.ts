export type NotificationsQueryParams = {
  per_page?: number;
};

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  body: string;
  data: {
    permit_application_id: number;
    document_id?: number;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationsResponse = {
  status: "success";
  data: {
    data: Notification[];
    total: number;
    current_page: number;
  };
};

export type UnreadNotificationsCountResponse = {
  status: "success";
  data: {
    count: number;
  };
};

export type MarkAllNotificationsReadResponse = {
  status: "success";
  message: string;
};
