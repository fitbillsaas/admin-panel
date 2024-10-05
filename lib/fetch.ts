/* eslint-disable prettier/prettier */
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export interface QueryParams {
  offset?: number;
  limit?: number;
  sort?: string[][] | { [key: string]: 1 | -1 };
  where?: any;
  filters?: any;
  select?: string[];
  populate?: string[];
  search?: string;
  timezone?: string;
  data?: {
    [key: string]: any;
  };
}

export interface ApiResponse {
  data?: any;
  error?: any;
  validationErrors?: {
    property: string;
    constraints: { [key: string]: string };
  }[];
  message?: any;
  statusCode?: number;
  count?: number;
}

export interface HttpOptions {
  auth?: boolean;
  additionalHeaders?: any;
  isMultipart?: boolean;
}

const getHttpOption = async (options: HttpOptions): Promise<Headers> => {
  const { auth = true, additionalHeaders, isMultipart } = options;
  const headers: HeadersInit = new Headers();
  if (additionalHeaders && Object.keys(additionalHeaders).length) {
    for (const key in additionalHeaders) {
      headers.set(key, additionalHeaders[key]);
    }
  }
  if (!isMultipart) headers.set("Content-Type", "application/json");
  if (!!auth) {
    const session =
      typeof window === "undefined"
        ? await getServerSession(authOptions)
        : await getSession();
    if (!!session) {
      headers.set("Authorization", `Bearer ${session?.user?.accessToken}`);
    }
  }
  return headers;
};

const convertFilterToWhere = (filters: any) => {
  const where: { [key: string]: any } = { ...filters };
  for (const key in where) {
    if (Object.prototype.hasOwnProperty.call(where, key)) {
      if (where[key] === undefined || where[key] === null) {
        delete where[key];
        continue;
      }
      if (typeof where[key] === "object") {
        if (Array.isArray(where[key])) {
          continue;
        }
        where[key] = convertFilterToWhere(where[key]);
        if (Object.entries(where[key]).length === 0) {
          delete where[key];
        }
      }
    }
  }
  return where;
};

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const generateQueryUrl = (path: string, options?: QueryParams): string => {
  let url = `${API_ENDPOINT}/${path}?`;
  if (typeof options === "undefined") {
    return url;
  }
  if (!isNaN(Number(options.limit))) {
    url += "limit=" + options.limit + "&";
  }
  if (!isNaN(Number(options.offset))) {
    url += "offset=" + options.offset + "&";
  }
  if (options.search) {
    url += "search=" + options.search + "&";
  }
  if (options.sort && Array.isArray(options.sort)) {
    url += "sort=" + JSON.stringify(options.sort) + "&";
  }
  if (options.where && typeof options.where === "object") {
    url += "where=" + encodeURIComponent(JSON.stringify(options.where)) + "&";
  } else if (options.filters && typeof options.filters === "object") {
    url +=
      "where=" +
      encodeURIComponent(
        JSON.stringify(convertFilterToWhere(options.filters)),
      ) +
      "&";
  }
  if (options.select && Array.isArray(options.select)) {
    url += "select=" + JSON.stringify(options.select) + "&";
  }
  if (options.populate && Array.isArray(options.populate)) {
    url += "populate=" + JSON.stringify(options.populate) + "&";
  }
  if (options.timezone) {
    url += "timezone=" + options.timezone + "&";
  }
  if (options.data && typeof options.data === "object") {
    for (const key in options.data) {
      if (Object.prototype.hasOwnProperty.call(options.data, key)) {
        url += `${key}=${
          typeof options.data[key] === "object"
            ? JSON.stringify(options.data[key])
            : options.data[key]
        }&`;
      }
    }
  }
  return url.slice(0, -1);
};

const responseHandler = async (
  response: Response,
  isLogin: boolean = false,
) => {
  const res = await response.json();
  const statusCode = res.statusCode ?? response.status;
  if (statusCode === 401) {
    if (!isLogin) {
      if (typeof window !== "undefined") {
        await signOut();
      } else {
        redirect("/auth/redirect-login");
      }
    }
  }
  if (statusCode === 400 && Array.isArray(res.message)) {
    return {
      ...res,
      message: res.error,
      validationErrors: res.message,
    };
  }
  return { ...res, statusCode };
};

const errorHandler = (error: any): any => {
  return { error, message: error.message || "error", statusCode: 500 };
};

/**
 * login
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Login = async (
  body: any,
  queryParams?: QueryParams,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl("auth/local", queryParams), {
      method: "POST",
      body: JSON.stringify(body),
      headers: await getHttpOption({ auth: false }),
      ...requestInit,
    });
    return responseHandler(response, true);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchMe
 * @param queryParams
 * @param options
 */
const Me = async (
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl("user/me", queryParams), {
      method: "GET",
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchUpdateMe
 * @param body
 * @param queryParams
 * @param options
 */
const UpdateMe = async (
  body: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl("user/me", queryParams), {
      method: "PUT",
      body: options?.isMultipart ? body : JSON.stringify(body),
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchGetAll
 *
 * @param entity
 * @param queryParams
 * @param options
 */
const GetAll = async (
  entity: string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "GET",
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchGetById
 *
 * @param entity
 * @param id
 * @param queryParams
 * @param options
 */
const GetById = async (
  entity: string,
  id: number | string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      generateQueryUrl(`${entity}/${id}`, queryParams),
      {
        method: "GET",
        headers: await getHttpOption(options || {}),
        ...requestInit,
      },
    );
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchFind
 *
 * @param entity
 * @param queryParams
 * @param options
 */
const Find = async (
  entity: string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      generateQueryUrl(`${entity}/find`, queryParams),
      {
        method: "GET",
        headers: await getHttpOption(options || {}),
        ...requestInit,
      },
    );
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchGetCount
 *
 * @param entity
 * @param queryParams
 * @param options
 */
const GetCount = async (
  entity: string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      generateQueryUrl(`${entity}/count`, queryParams),
      {
        method: "GET",
        headers: await getHttpOption(options || {}),
        ...requestInit,
      },
    );
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchCreate
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Create = async (
  entity: string,
  body?: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "POST",
      body: options?.isMultipart ? body : JSON.stringify(body),
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchUpdateById
 *
 * @param entity
 * @param id
 * @param body
 * @param queryParams
 * @param options
 */
const UpdateById = async (
  entity: string,
  id: number | string,
  body: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      generateQueryUrl(`${entity}/${id}`, queryParams),
      {
        method: "PUT",
        body: options?.isMultipart ? body : JSON.stringify(body),
        headers: await getHttpOption(options || {}),
        ...requestInit,
      },
    );
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchDeleteById
 *
 * @param entity
 * @param id
 * @param queryParams
 * @param options
 */
const DeleteById = async (
  entity: string,
  id: number | string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      generateQueryUrl(`${entity}/${id}`, queryParams),
      {
        method: "DELETE",
        headers: await getHttpOption(options || {}),
        ...requestInit,
      },
    );
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchGet
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Get = async (
  entity: string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "GET",
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchPost
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Post = async (
  entity: string,
  body: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "POST",
      body: options?.isMultipart ? body : JSON.stringify(body),
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchPut
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Put = async (
  entity: string,
  body: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "PUT",
      body: options?.isMultipart ? body : JSON.stringify(body),
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchPatch
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Patch = async (
  entity: string,
  body: any,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "PATCH",
      body: options?.isMultipart ? body : JSON.stringify(body),
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

/**
 * fetchDelete
 *
 * @param entity
 * @param body
 * @param queryParams
 * @param options
 */
const Delete = async (
  entity: string,
  queryParams?: QueryParams,
  options?: HttpOptions,
  requestInit?: RequestInit,
): Promise<ApiResponse> => {
  try {
    const response = await fetch(generateQueryUrl(entity, queryParams), {
      method: "DELETE",
      headers: await getHttpOption(options || {}),
      ...requestInit,
    });
    return responseHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

export const API = {
  Create,
  Delete,
  DeleteById,
  Find,
  Get,
  GetAll,
  GetById,
  GetCount,
  Login,
  Me,
  Patch,
  Post,
  Put,
  UpdateById,
  UpdateMe,
  fetch,
};
