export interface PaginatedDto<T> {
  data: T[];
  pagination: { total: number };
}

export interface IdResponseDto {
  id: string;
}

export interface SuccessResponseDto {
  success: boolean;
}

export interface LibraryListItemDto {
  id: string;
  name: string;
  type: { id: string; name: string } | null;
  direction: {
    lat: number;
    lon: number;
    corregimiento: { id: string; name: string } | null;
  } | null;
  status: string;
  isOpen: boolean;
}

export interface LibraryDetailDto {
  id: string;
  name: string;
  type: { id: string; name: string };
  description: string;
  email: string;
  phone: string;
  status: string;
  direction: {
    description: string;
    zone: string;
    lat: number;
    lon: number;
    corregimiento: { id: string; name: string };
  };
  activities: { id: string; name: string }[];
  services: { id: string; name: string }[];
  dailySchedules: {
    day: string;
    startTime: string;
    endTime: string;
    closed: boolean;
  }[];
  pictures: { key: string; name: string; type: string; url: string }[];
  events: {
    id: string;
    name: string;
    schedule: { date: string; initTime: string; endTime: string };
    picture: { key: string; name: string; type: string; url: string } | null;
  }[];
}

export interface LibraryLocationDto {
  id: string;
  name: string;
  description: string | null;
  lat: number | null;
  lon: number | null;
  zone: string | null;
  corregimiento: string;
}

export interface CreateLibraryDto {
  name: string;
  description: string;
}

export interface UpdateLibraryInfoDto {
  name?: string;
  description?: string;
  typeId?: string;
  email?: string;
  phone?: string;
}

export interface UpdateLibraryDirectionDto {
  description?: string;
  zone?: string;
  lon?: number;
  lat?: number;
  corregimientoId?: string;
}

export interface UpdateScheduleDto {
  day: number;
  startTimeHour?: number;
  startTimeMin?: number;
  endTimeHour?: number;
  endTimeMin?: number;
  closed?: boolean;
}

export interface LibraryQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  typeId?: string;
  corregimientoId?: string;
  status?: string;
  zone?: string;
  activityId?: string;
  serviceId?: string;
  open?: boolean;
}

export interface EventListItemDto {
  id: string;
  name: string;
  picture: { key: string; name: string; type: string; url: string } | null;
  type: { id: string; name: string };
  library: { id: string; name: string };
  schedule: { date: string; initTime: string };
}

export interface EventDetailDto {
  id: string;
  name: string;
  type: { id: string; name: string };
  library: { id: string; name: string };
  schedule: { date: string; initTime: string; endTime: string };
  description: string;
  picture: { key: string; name: string; type: string; url: string } | null;
}

export interface CreateEventDto {
  name: string;
  typeId: string;
  libraryId: string;
  day: number;
  month: number;
  year: number;
  startTimeHour: number;
  startTimeMin: number;
  endTimeHour: number;
  endTimeMin: number;
  description: string;
}

export interface UpdateEventDto {
  name?: string;
  typeId?: string;
  libraryId?: string;
  day?: number;
  month?: number;
  year?: number;
  startTimeHour?: number;
  startTimeMin?: number;
  endTimeHour?: number;
  endTimeMin?: number;
  description?: string;
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  typeId?: string;
  libraryId?: string;
}

export interface CatalogItemDto {
  id: string;
  name: string;
}

export interface CreateCatalogDto {
  name: string;
}

export interface CatalogQueryParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface ActivityLibraryItemDto {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}

export interface CreateActivityLibraryDto {
  name: string;
  description: string;
  categoryId: string;
}

export interface ActivityLibraryQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  categoryId?: string;
}
