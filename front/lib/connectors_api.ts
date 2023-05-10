import { Err, Ok, Result } from "@app/lib/result";

export type ConnectorsAPIErrorResponse = {
  error: {
    message: string;
  };
};

const {
  CONNECTORS_API = "http://127.0.0.1:3002",
  DUST_CONNECTORS_SECRET = "",
} = process.env;

export type ConnectorsAPIResponse<T> = Result<T, ConnectorsAPIErrorResponse>;
export type ConnectorSyncStatus = "succeeded" | "failed";
export type ConnectorProvider = "slack" | "notion";
export type ConnectorType = {
  id: string;
  type: ConnectorProvider;

  lastSyncStatus?: ConnectorSyncStatus;
  lastSyncStartTime?: number;
  lastSyncFinishTime?: number;
  lastSyncSuccessfulTime?: number;
  firstSuccessfulSyncTime?: number;
  firstSyncProgress?: string;
};

export const ConnectorsAPI = {
  async createConnector(
    provider: ConnectorProvider,
    workspaceId: string,
    workspaceAPIKey: string,
    dataSourceName: string,
    nangoConnectionId: string
  ): Promise<ConnectorsAPIResponse<ConnectorType>> {
    const res = await fetch(`${CONNECTORS_API}/connectors/create/${provider}`, {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        workspaceId,
        workspaceAPIKey,
        dataSourceName,
        nangoConnectionId,
      }),
    });

    return _resultFromResponse(res);
  },

  async pauseConnector(
    provider: ConnectorProvider,
    workspaceId: string,
    dataSourceName: string
  ): Promise<ConnectorsAPIResponse<{ connectorId: string }>> {
    const res = await fetch(`${CONNECTORS_API}/connectors/pause/${provider}`, {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        workspaceId,
        dataSourceName,
      }),
    });

    return _resultFromResponse(res);
  },

  async resumeConnector(
    provider: ConnectorProvider,
    workspaceId: string,
    workspaceAPIKey: string,
    dataSourceName: string,
    nangoConnectionId: string
  ): Promise<ConnectorsAPIResponse<{ connectorId: string }>> {
    const res = await fetch(`${CONNECTORS_API}/connectors/resume/${provider}`, {
      method: "POST",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        workspaceId,
        workspaceAPIKey,
        dataSourceName,
        nangoConnectionId,
      }),
    });

    return _resultFromResponse(res);
  },

  async deleteConnector(
    provider: ConnectorProvider,
    workspaceId: string,
    dataSourceName: string
  ): Promise<ConnectorsAPIResponse<{ success: true }>> {
    const res = await fetch(`${CONNECTORS_API}/connectors/delete/${provider}`, {
      method: "DELETE",
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        workspaceId,
        dataSourceName,
      }),
    });

    return _resultFromResponse(res);
  },

  async getConnector(
    connectorId: string
  ): Promise<ConnectorsAPIResponse<ConnectorType>> {
    const res = await fetch(`${CONNECTORS_API}/connectors/${connectorId}`, {
      method: "GET",
      headers: getDefaultHeaders(),
    });

    return _resultFromResponse(res);
  },
};

function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DUST_CONNECTORS_SECRET}`,
  };
}
async function _resultFromResponse<T>(
  response: Response
): Promise<ConnectorsAPIResponse<T>> {
  if (!response.ok) {
    if (response.headers.get("Content-Type") === "application/json") {
      return new Err(await response.json());
    } else {
      return new Err({
        error: {
          message: `Unexpected response status: ${response.status} ${response.statusText}`,
        },
      });
    }
  }
  const jsonResponse = await response.json();

  return new Ok(jsonResponse);
}
