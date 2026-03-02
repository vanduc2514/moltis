/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type AgentIdentity = {
  __typename?: 'AgentIdentity';
  emoji?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
};

export type AgentMutation = {
  __typename?: 'AgentMutation';
  /** Run agent with parameters. */
  run: Scalars['JSON']['output'];
  /** Run agent and wait for completion. */
  runWait: Scalars['JSON']['output'];
  /** Update agent identity. */
  updateIdentity: BoolResult;
  /** Update agent soul/personality. */
  updateSoul: BoolResult;
};


export type AgentMutationRunArgs = {
  input: Scalars['JSON']['input'];
};


export type AgentMutationRunWaitArgs = {
  input: Scalars['JSON']['input'];
};


export type AgentMutationUpdateIdentityArgs = {
  input: Scalars['JSON']['input'];
};


export type AgentMutationUpdateSoulArgs = {
  soul: Scalars['String']['input'];
};

export type AgentQuery = {
  __typename?: 'AgentQuery';
  /** Get agent identity. */
  identity: AgentIdentity;
  /** List available agents. */
  list: Scalars['JSON']['output'];
};

/** Generic boolean result for mutations that return `{ "ok": true }`. */
export type BoolResult = {
  __typename?: 'BoolResult';
  ok: Scalars['Boolean']['output'];
};

export type BrowserMutation = {
  __typename?: 'BrowserMutation';
  request: Scalars['JSON']['output'];
};


export type BrowserMutationRequestArgs = {
  input: Scalars['JSON']['input'];
};

export type ChannelInfo = {
  __typename?: 'ChannelInfo';
  accountId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ChannelMutation = {
  __typename?: 'ChannelMutation';
  add: BoolResult;
  approveSender: BoolResult;
  denySender: BoolResult;
  logout: BoolResult;
  remove: BoolResult;
  update: BoolResult;
};


export type ChannelMutationAddArgs = {
  input: Scalars['JSON']['input'];
};


export type ChannelMutationApproveSenderArgs = {
  input: Scalars['JSON']['input'];
};


export type ChannelMutationDenySenderArgs = {
  input: Scalars['JSON']['input'];
};


export type ChannelMutationLogoutArgs = {
  name: Scalars['String']['input'];
};


export type ChannelMutationRemoveArgs = {
  name: Scalars['String']['input'];
};


export type ChannelMutationUpdateArgs = {
  input: Scalars['JSON']['input'];
};

export type ChannelOtpPending = {
  __typename?: 'ChannelOtpPending';
  code?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['Int']['output']>;
};

export type ChannelQuery = {
  __typename?: 'ChannelQuery';
  /** List all channels. */
  list: Array<ChannelInfo>;
  /** List pending channel senders. */
  senders: ChannelSendersResult;
  /** Get channel status. */
  status: BoolResult;
};

export type ChannelSender = {
  __typename?: 'ChannelSender';
  allowed?: Maybe<Scalars['Boolean']['output']>;
  lastSeen?: Maybe<Scalars['Int']['output']>;
  messageCount?: Maybe<Scalars['Int']['output']>;
  otpPending?: Maybe<ChannelOtpPending>;
  peerId?: Maybe<Scalars['String']['output']>;
  senderName?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ChannelSendersResult = {
  __typename?: 'ChannelSendersResult';
  senders: Array<ChannelSender>;
};

export type ChatMutation = {
  __typename?: 'ChatMutation';
  /** Abort active chat response. */
  abort: BoolResult;
  /** Cancel queued chat messages. */
  cancelQueued: BoolResult;
  /** Clear chat history for session. */
  clear: BoolResult;
  /** Compact chat messages. */
  compact: BoolResult;
  /** Inject a message into chat history. */
  inject: BoolResult;
  /** Send a chat message. */
  send: BoolResult;
};


export type ChatMutationAbortArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatMutationCancelQueuedArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatMutationClearArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatMutationCompactArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatMutationInjectArgs = {
  input: Scalars['JSON']['input'];
};


export type ChatMutationSendArgs = {
  message: Scalars['String']['input'];
  model?: InputMaybe<Scalars['String']['input']>;
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};

export type ChatQuery = {
  __typename?: 'ChatQuery';
  /** Get chat context data. */
  context: Scalars['JSON']['output'];
  /** Get full context with rendering (OpenAI messages format). */
  fullContext: Scalars['JSON']['output'];
  /** Get chat history for a session. */
  history: Scalars['JSON']['output'];
  /** Get rendered system prompt. */
  rawPrompt: ChatRawPrompt;
};


export type ChatQueryContextArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatQueryFullContextArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatQueryHistoryArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};


export type ChatQueryRawPromptArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};

export type ChatRawPrompt = {
  __typename?: 'ChatRawPrompt';
  charCount?: Maybe<Scalars['Int']['output']>;
  nativeTools?: Maybe<Scalars['Boolean']['output']>;
  prompt?: Maybe<Scalars['String']['output']>;
  toolCount?: Maybe<Scalars['Int']['output']>;
};

export type ClientInfo = {
  __typename?: 'ClientInfo';
  connId?: Maybe<Scalars['String']['output']>;
  connectedAt?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

export type ConfigMutation = {
  __typename?: 'ConfigMutation';
  /** Apply full config. */
  apply: BoolResult;
  /** Patch config. */
  patch: BoolResult;
  /** Set a config value. */
  set: BoolResult;
};


export type ConfigMutationApplyArgs = {
  config: Scalars['JSON']['input'];
};


export type ConfigMutationPatchArgs = {
  patch: Scalars['JSON']['input'];
};


export type ConfigMutationSetArgs = {
  path: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type ConfigQuery = {
  __typename?: 'ConfigQuery';
  /** Get config value at a path. Returns dynamic user-defined config data. */
  get: Scalars['JSON']['output'];
  /** Get config schema definition. Returns dynamic JSON schema. */
  schema: Scalars['JSON']['output'];
};


export type ConfigQueryGetArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

export type ContextFile = {
  __typename?: 'ContextFile';
  content?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
};

export type CronJob = {
  __typename?: 'CronJob';
  createdAtMs?: Maybe<Scalars['Int']['output']>;
  deleteAfterRun?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['JSON']['output']>;
  schedule?: Maybe<Scalars['JSON']['output']>;
  sessionTarget?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['JSON']['output']>;
  updatedAtMs?: Maybe<Scalars['Int']['output']>;
};

export type CronMutation = {
  __typename?: 'CronMutation';
  add: BoolResult;
  remove: BoolResult;
  /** Trigger a cron job immediately. */
  run: BoolResult;
  update: BoolResult;
};


export type CronMutationAddArgs = {
  input: Scalars['JSON']['input'];
};


export type CronMutationRemoveArgs = {
  id: Scalars['String']['input'];
};


export type CronMutationRunArgs = {
  id: Scalars['String']['input'];
};


export type CronMutationUpdateArgs = {
  input: Scalars['JSON']['input'];
};

export type CronQuery = {
  __typename?: 'CronQuery';
  /** List all cron jobs. */
  list: Array<CronJob>;
  /** Get run history for a cron job. */
  runs: Array<CronRunRecord>;
  /** Get cron status. */
  status: CronStatus;
};


export type CronQueryRunsArgs = {
  jobId: Scalars['String']['input'];
};

export type CronRunRecord = {
  __typename?: 'CronRunRecord';
  durationMs?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  finishedAtMs?: Maybe<Scalars['Int']['output']>;
  inputTokens?: Maybe<Scalars['Int']['output']>;
  jobId?: Maybe<Scalars['String']['output']>;
  output?: Maybe<Scalars['String']['output']>;
  outputTokens?: Maybe<Scalars['Int']['output']>;
  startedAtMs?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type CronStatus = {
  __typename?: 'CronStatus';
  enabledCount?: Maybe<Scalars['Int']['output']>;
  jobCount?: Maybe<Scalars['Int']['output']>;
  nextRunAtMs?: Maybe<Scalars['Int']['output']>;
  running?: Maybe<Scalars['Boolean']['output']>;
};

export type DeviceMutation = {
  __typename?: 'DeviceMutation';
  pairApprove: BoolResult;
  pairReject: BoolResult;
  tokenRevoke: BoolResult;
  tokenRotate: BoolResult;
};


export type DeviceMutationPairApproveArgs = {
  deviceId: Scalars['String']['input'];
};


export type DeviceMutationPairRejectArgs = {
  deviceId: Scalars['String']['input'];
};


export type DeviceMutationTokenRevokeArgs = {
  deviceId: Scalars['String']['input'];
};


export type DeviceMutationTokenRotateArgs = {
  deviceId: Scalars['String']['input'];
};

export type DeviceQuery = {
  __typename?: 'DeviceQuery';
  /** List paired devices. */
  pairRequests: Scalars['JSON']['output'];
};

export type ExecApprovalConfig = {
  __typename?: 'ExecApprovalConfig';
  mode?: Maybe<Scalars['String']['output']>;
  securityLevel?: Maybe<Scalars['String']['output']>;
};

export type ExecApprovalMutation = {
  __typename?: 'ExecApprovalMutation';
  request: BoolResult;
  resolve: BoolResult;
  set: BoolResult;
  setNodeConfig: BoolResult;
};


export type ExecApprovalMutationRequestArgs = {
  input: Scalars['JSON']['input'];
};


export type ExecApprovalMutationResolveArgs = {
  input: Scalars['JSON']['input'];
};


export type ExecApprovalMutationSetArgs = {
  input: Scalars['JSON']['input'];
};


export type ExecApprovalMutationSetNodeConfigArgs = {
  input: Scalars['JSON']['input'];
};

export type ExecApprovalQuery = {
  __typename?: 'ExecApprovalQuery';
  /** Get execution approval settings. */
  get: ExecApprovalConfig;
  /** Get node-specific approval settings. */
  nodeConfig: ExecNodeConfig;
};

export type ExecNodeConfig = {
  __typename?: 'ExecNodeConfig';
  mode?: Maybe<Scalars['String']['output']>;
};

export type GenericEvent = {
  __typename?: 'GenericEvent';
  data: Scalars['JSON']['output'];
};

export type HealthInfo = {
  __typename?: 'HealthInfo';
  connections?: Maybe<Scalars['Int']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type HeartbeatActiveHours = {
  __typename?: 'HeartbeatActiveHours';
  end?: Maybe<Scalars['String']['output']>;
  start?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
};

export type HeartbeatConfig = {
  __typename?: 'HeartbeatConfig';
  ackMaxChars?: Maybe<Scalars['Int']['output']>;
  activeHours?: Maybe<HeartbeatActiveHours>;
  channel?: Maybe<Scalars['String']['output']>;
  deliver?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  every?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  prompt?: Maybe<Scalars['String']['output']>;
  sandboxEnabled?: Maybe<Scalars['Boolean']['output']>;
  sandboxImage?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
};

export type HeartbeatMutation = {
  __typename?: 'HeartbeatMutation';
  run: BoolResult;
  update: BoolResult;
};


export type HeartbeatMutationUpdateArgs = {
  input: Scalars['JSON']['input'];
};

export type HeartbeatQuery = {
  __typename?: 'HeartbeatQuery';
  /** Get heartbeat run history. */
  runs: Array<CronRunRecord>;
  /** Get heartbeat configuration and status. */
  status: HeartbeatStatus;
};


export type HeartbeatQueryRunsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type HeartbeatStatus = {
  __typename?: 'HeartbeatStatus';
  config?: Maybe<HeartbeatConfig>;
  hasPrompt?: Maybe<Scalars['Boolean']['output']>;
  heartbeatFileExists?: Maybe<Scalars['Boolean']['output']>;
  job?: Maybe<CronJob>;
  promptSource?: Maybe<Scalars['String']['output']>;
};

export type HookInfo = {
  __typename?: 'HookInfo';
  callCount?: Maybe<Scalars['Int']['output']>;
  command?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  eligible?: Maybe<Scalars['Boolean']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  events?: Maybe<Array<Scalars['String']['output']>>;
  failureCount?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  timeout?: Maybe<Scalars['Int']['output']>;
};

export type HooksMutation = {
  __typename?: 'HooksMutation';
  disable: BoolResult;
  enable: BoolResult;
  reload: BoolResult;
  save: BoolResult;
};


export type HooksMutationDisableArgs = {
  name: Scalars['String']['input'];
};


export type HooksMutationEnableArgs = {
  name: Scalars['String']['input'];
};


export type HooksMutationSaveArgs = {
  input: Scalars['JSON']['input'];
};

export type HooksQuery = {
  __typename?: 'HooksQuery';
  /** List discovered hooks with stats. */
  list: Array<HookInfo>;
};

export type LocalBackendInfo = {
  __typename?: 'LocalBackendInfo';
  available?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  installCommands?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LocalLlmMutation = {
  __typename?: 'LocalLlmMutation';
  configure: BoolResult;
  configureCustom: BoolResult;
  removeModel: BoolResult;
};


export type LocalLlmMutationConfigureArgs = {
  input: Scalars['JSON']['input'];
};


export type LocalLlmMutationConfigureCustomArgs = {
  input: Scalars['JSON']['input'];
};


export type LocalLlmMutationRemoveModelArgs = {
  input: Scalars['JSON']['input'];
};

export type LocalLlmQuery = {
  __typename?: 'LocalLlmQuery';
  /** List available local models. */
  models: Array<ModelInfo>;
  /** Search HuggingFace models. */
  searchHf: Scalars['JSON']['output'];
  /** Get local LLM status. */
  status: BoolResult;
  /** Get system information for local LLM. */
  systemInfo: LocalSystemInfo;
};


export type LocalLlmQuerySearchHfArgs = {
  query: Scalars['String']['input'];
};

export type LocalSystemInfo = {
  __typename?: 'LocalSystemInfo';
  availableBackends?: Maybe<Array<LocalBackendInfo>>;
  availableRamGb?: Maybe<Scalars['Float']['output']>;
  backendNote?: Maybe<Scalars['String']['output']>;
  hasCuda?: Maybe<Scalars['Boolean']['output']>;
  hasGpu?: Maybe<Scalars['Boolean']['output']>;
  hasMetal?: Maybe<Scalars['Boolean']['output']>;
  isAppleSilicon?: Maybe<Scalars['Boolean']['output']>;
  memoryTier?: Maybe<Scalars['String']['output']>;
  mlxAvailable?: Maybe<Scalars['Boolean']['output']>;
  recommendedBackend?: Maybe<Scalars['String']['output']>;
  totalRamGb?: Maybe<Scalars['Float']['output']>;
};

export type LogEnabledLevels = {
  __typename?: 'LogEnabledLevels';
  debug?: Maybe<Scalars['Boolean']['output']>;
  trace?: Maybe<Scalars['Boolean']['output']>;
};

export type LogEntry = {
  __typename?: 'LogEntry';
  fields?: Maybe<Scalars['JSON']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  ts?: Maybe<Scalars['Int']['output']>;
};

export type LogListResult = {
  __typename?: 'LogListResult';
  entries: Array<LogEntry>;
};

export type LogStatus = {
  __typename?: 'LogStatus';
  enabledLevels?: Maybe<LogEnabledLevels>;
  unseenErrors?: Maybe<Scalars['Int']['output']>;
  unseenWarns?: Maybe<Scalars['Int']['output']>;
};

export type LogTailResult = {
  __typename?: 'LogTailResult';
  entries: Array<LogEntry>;
  subscribed?: Maybe<Scalars['Boolean']['output']>;
};

export type LogsMutation = {
  __typename?: 'LogsMutation';
  ack: BoolResult;
};

export type LogsQuery = {
  __typename?: 'LogsQuery';
  /** List logs. */
  list: LogListResult;
  /** Get log status. */
  status: LogStatus;
  /** Stream log tail. */
  tail: LogTailResult;
};


export type LogsQueryTailArgs = {
  lines?: InputMaybe<Scalars['Int']['input']>;
};

export type McpMutation = {
  __typename?: 'McpMutation';
  add: BoolResult;
  disable: BoolResult;
  enable: BoolResult;
  oauthComplete: BoolResult;
  oauthStart: McpOAuthStartResult;
  reauth: BoolResult;
  remove: BoolResult;
  restart: BoolResult;
  update: BoolResult;
};


export type McpMutationAddArgs = {
  input: Scalars['JSON']['input'];
};


export type McpMutationDisableArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationEnableArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationOauthCompleteArgs = {
  input: Scalars['JSON']['input'];
};


export type McpMutationOauthStartArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationReauthArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationRemoveArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationRestartArgs = {
  name: Scalars['String']['input'];
};


export type McpMutationUpdateArgs = {
  input: Scalars['JSON']['input'];
};

export type McpOAuthStartResult = {
  __typename?: 'McpOAuthStartResult';
  authUrl?: Maybe<Scalars['String']['output']>;
  oauthPending?: Maybe<Scalars['Boolean']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

export type McpQuery = {
  __typename?: 'McpQuery';
  /** List MCP servers. */
  list: Array<McpServer>;
  /** Get MCP system status. */
  status: BoolResult;
  /** Get MCP server tools. */
  tools: Array<McpTool>;
};


export type McpQueryToolsArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type McpServer = {
  __typename?: 'McpServer';
  command?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  toolCount?: Maybe<Scalars['Int']['output']>;
  transport?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type McpTool = {
  __typename?: 'McpTool';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  server?: Maybe<Scalars['String']['output']>;
};

export type MemoryConfig = {
  __typename?: 'MemoryConfig';
  backend?: Maybe<Scalars['String']['output']>;
  citations?: Maybe<Scalars['String']['output']>;
  disableRag?: Maybe<Scalars['Boolean']['output']>;
  llmReranking?: Maybe<Scalars['Boolean']['output']>;
  qmdFeatureEnabled?: Maybe<Scalars['Boolean']['output']>;
  sessionExport?: Maybe<Scalars['Boolean']['output']>;
};

export type MemoryMutation = {
  __typename?: 'MemoryMutation';
  updateConfig: BoolResult;
};


export type MemoryMutationUpdateConfigArgs = {
  input: Scalars['JSON']['input'];
};

export type MemoryQuery = {
  __typename?: 'MemoryQuery';
  /** Get memory configuration. */
  config: MemoryConfig;
  /** Get QMD status. */
  qmdStatus: BoolResult;
  /** Get memory system status. */
  status: MemoryStatus;
};

/** Memory usage breakdown. */
export type MemoryStats = {
  __typename?: 'MemoryStats';
  /** System available memory in bytes. */
  available: Scalars['Int']['output'];
  /** Process RSS in bytes. */
  process: Scalars['Int']['output'];
  /** System total memory in bytes. */
  total: Scalars['Int']['output'];
};

export type MemoryStatus = {
  __typename?: 'MemoryStatus';
  backend?: Maybe<Scalars['String']['output']>;
  chunkCount?: Maybe<Scalars['Int']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  fileCount?: Maybe<Scalars['Int']['output']>;
};

export type ModelInfo = {
  __typename?: 'ModelInfo';
  contextWindow?: Maybe<Scalars['Int']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  maxOutputTokens?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  supportsStreaming?: Maybe<Scalars['Boolean']['output']>;
  supportsTools?: Maybe<Scalars['Boolean']['output']>;
  supportsVision?: Maybe<Scalars['Boolean']['output']>;
};

export type ModelMutation = {
  __typename?: 'ModelMutation';
  detectSupported: BoolResult;
  disable: BoolResult;
  enable: BoolResult;
  test: ModelTestResult;
};


export type ModelMutationDisableArgs = {
  input: Scalars['JSON']['input'];
};


export type ModelMutationEnableArgs = {
  input: Scalars['JSON']['input'];
};


export type ModelMutationTestArgs = {
  input: Scalars['JSON']['input'];
};

export type ModelQuery = {
  __typename?: 'ModelQuery';
  /** List enabled models. */
  list: Array<ModelInfo>;
  /** List all available models. */
  listAll: Array<ModelInfo>;
};

export type ModelTestResult = {
  __typename?: 'ModelTestResult';
  modelId?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  agents: AgentMutation;
  browser: BrowserMutation;
  channels: ChannelMutation;
  chat: ChatMutation;
  config: ConfigMutation;
  cron: CronMutation;
  device: DeviceMutation;
  execApprovals: ExecApprovalMutation;
  heartbeat: HeartbeatMutation;
  hooks: HooksMutation;
  logs: LogsMutation;
  mcp: McpMutation;
  memory: MemoryMutation;
  models: ModelMutation;
  node: NodeMutation;
  projects: ProjectMutation;
  providers: ProviderMutation;
  sessions: SessionMutation;
  skills: SkillsMutation;
  stt: SttMutation;
  system: SystemMutation;
  tts: TtsMutation;
  voice: VoiceMutation;
  voicewake: VoicewakeMutation;
};

export type NodeDescription = {
  __typename?: 'NodeDescription';
  capabilities?: Maybe<Array<Scalars['String']['output']>>;
  commands?: Maybe<Array<Scalars['String']['output']>>;
  connectedAt?: Maybe<Scalars['Int']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  nodeId?: Maybe<Scalars['String']['output']>;
  pathEnv?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Scalars['JSON']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  remoteIp?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type NodeInfo = {
  __typename?: 'NodeInfo';
  connId?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  nodeId?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type NodeMutation = {
  __typename?: 'NodeMutation';
  /** Forward RPC request to a node. */
  invoke: Scalars['JSON']['output'];
  /** Approve node pairing. */
  pairApprove: BoolResult;
  /** Reject node pairing. */
  pairReject: BoolResult;
  /** Request pairing with a new node. */
  pairRequest: BoolResult;
  /** Verify node pairing signature. */
  pairVerify: BoolResult;
  /** Rename a connected node. */
  rename: BoolResult;
};


export type NodeMutationInvokeArgs = {
  input: Scalars['JSON']['input'];
};


export type NodeMutationPairApproveArgs = {
  requestId: Scalars['String']['input'];
};


export type NodeMutationPairRejectArgs = {
  requestId: Scalars['String']['input'];
};


export type NodeMutationPairRequestArgs = {
  input: Scalars['JSON']['input'];
};


export type NodeMutationPairVerifyArgs = {
  input: Scalars['JSON']['input'];
};


export type NodeMutationRenameArgs = {
  displayName: Scalars['String']['input'];
  nodeId: Scalars['String']['input'];
};

export type NodeQuery = {
  __typename?: 'NodeQuery';
  /** Get detailed info for a specific node. */
  describe: NodeDescription;
  /** List all connected nodes. */
  list: Array<NodeInfo>;
  /** List pending pairing requests. */
  pairRequests: Scalars['JSON']['output'];
};


export type NodeQueryDescribeArgs = {
  nodeId: Scalars['String']['input'];
};

export type Project = {
  __typename?: 'Project';
  autoWorktree?: Maybe<Scalars['Boolean']['output']>;
  branchPrefix?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  detected?: Maybe<Scalars['Boolean']['output']>;
  directory?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  sandboxImage?: Maybe<Scalars['String']['output']>;
  setupCommand?: Maybe<Scalars['String']['output']>;
  systemPrompt?: Maybe<Scalars['String']['output']>;
  teardownCommand?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ProjectContext = {
  __typename?: 'ProjectContext';
  contextFiles?: Maybe<Array<ContextFile>>;
  project?: Maybe<Project>;
};

export type ProjectMutation = {
  __typename?: 'ProjectMutation';
  delete: BoolResult;
  detect: BoolResult;
  upsert: BoolResult;
};


export type ProjectMutationDeleteArgs = {
  id: Scalars['String']['input'];
};


export type ProjectMutationUpsertArgs = {
  input: Scalars['JSON']['input'];
};

export type ProjectQuery = {
  __typename?: 'ProjectQuery';
  /** Path completion for projects. */
  completePath: Array<Scalars['String']['output']>;
  /** Get project context. */
  context: ProjectContext;
  /** Get a project by ID. */
  get: Project;
  /** List all projects. */
  list: Array<Project>;
};


export type ProjectQueryCompletePathArgs = {
  prefix: Scalars['String']['input'];
};


export type ProjectQueryContextArgs = {
  id: Scalars['String']['input'];
};


export type ProjectQueryGetArgs = {
  id: Scalars['String']['input'];
};

export type ProviderInfo = {
  __typename?: 'ProviderInfo';
  authMethod?: Maybe<Scalars['String']['output']>;
  configured?: Maybe<Scalars['Boolean']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  models?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
};

export type ProviderMutation = {
  __typename?: 'ProviderMutation';
  addCustom: BoolResult;
  /** Local LLM mutations. */
  local: LocalLlmMutation;
  oauthComplete: BoolResult;
  oauthStart: ProviderOAuthStartResult;
  removeKey: BoolResult;
  saveKey: BoolResult;
  saveModel: BoolResult;
  saveModels: BoolResult;
  validateKey: BoolResult;
};


export type ProviderMutationAddCustomArgs = {
  input: Scalars['JSON']['input'];
};


export type ProviderMutationOauthCompleteArgs = {
  input: Scalars['JSON']['input'];
};


export type ProviderMutationOauthStartArgs = {
  provider: Scalars['String']['input'];
};


export type ProviderMutationRemoveKeyArgs = {
  provider: Scalars['String']['input'];
};


export type ProviderMutationSaveKeyArgs = {
  input: Scalars['JSON']['input'];
};


export type ProviderMutationSaveModelArgs = {
  input: Scalars['JSON']['input'];
};


export type ProviderMutationSaveModelsArgs = {
  input: Scalars['JSON']['input'];
};


export type ProviderMutationValidateKeyArgs = {
  input: Scalars['JSON']['input'];
};

export type ProviderOAuthStartResult = {
  __typename?: 'ProviderOAuthStartResult';
  alreadyAuthenticated?: Maybe<Scalars['Boolean']['output']>;
  authUrl?: Maybe<Scalars['String']['output']>;
  deviceFlow?: Maybe<Scalars['Boolean']['output']>;
  userCode?: Maybe<Scalars['String']['output']>;
  verificationUri?: Maybe<Scalars['String']['output']>;
  verificationUriComplete?: Maybe<Scalars['String']['output']>;
};

export type ProviderQuery = {
  __typename?: 'ProviderQuery';
  /** List available provider integrations. */
  available: Array<ProviderInfo>;
  /** Local LLM queries. */
  local: LocalLlmQuery;
  /** Get OAuth status. */
  oauthStatus: BoolResult;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  /** Agent queries. */
  agents: AgentQuery;
  /** Channel queries. */
  channels: ChannelQuery;
  /** Chat queries (history, context). */
  chat: ChatQuery;
  /** Configuration queries. */
  config: ConfigQuery;
  /** Cron job queries. */
  cron: CronQuery;
  /** Device pairing queries. */
  device: DeviceQuery;
  /** Execution approval queries. */
  execApprovals: ExecApprovalQuery;
  /** Gateway health check. */
  health: HealthInfo;
  /** Heartbeat queries. */
  heartbeat: HeartbeatQuery;
  /** Hook queries. */
  hooks: HooksQuery;
  /** Log queries. */
  logs: LogsQuery;
  /** MCP server queries. */
  mcp: McpQuery;
  /** Memory system queries. */
  memory: MemoryQuery;
  /** Model queries. */
  models: ModelQuery;
  /** Node management queries. */
  node: NodeQuery;
  /** Project queries. */
  projects: ProjectQuery;
  /** Provider queries. */
  providers: ProviderQuery;
  /** Session queries. */
  sessions: SessionQuery;
  /** Skills queries. */
  skills: SkillsQuery;
  /** Gateway status with hostname, version, connections, uptime. */
  status: StatusInfo;
  /** STT queries. */
  stt: SttQuery;
  /** System queries (presence, heartbeat). */
  system: SystemQuery;
  /** TTS queries. */
  tts: TtsQuery;
  /** Usage and cost queries. */
  usage: UsageQuery;
  /** Voice configuration queries. */
  voice: VoiceQuery;
  /** Voicewake configuration. */
  voicewake: VoicewakeQuery;
};

export type SecurityScanResult = {
  __typename?: 'SecurityScanResult';
  installedSkillsDir?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  /** Raw mcp-scan output (external tool, variable shape). */
  results?: Maybe<Scalars['JSON']['output']>;
};

export type SecurityStatus = {
  __typename?: 'SecurityStatus';
  installHint?: Maybe<Scalars['String']['output']>;
  installedSkillsDir?: Maybe<Scalars['String']['output']>;
  mcpScanAvailable?: Maybe<Scalars['Boolean']['output']>;
  supported?: Maybe<Scalars['Boolean']['output']>;
  uvxAvailable?: Maybe<Scalars['Boolean']['output']>;
};

/** Whether a session currently has an active LLM run (waiting for response). */
export type SessionActiveResult = {
  __typename?: 'SessionActiveResult';
  active: Scalars['Boolean']['output'];
};

export type SessionBranch = {
  __typename?: 'SessionBranch';
  createdAt?: Maybe<Scalars['Int']['output']>;
  forkPoint?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  messageCount?: Maybe<Scalars['Int']['output']>;
};

export type SessionEntry = {
  __typename?: 'SessionEntry';
  archived?: Maybe<Scalars['Boolean']['output']>;
  channelBinding?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Int']['output']>;
  forkPoint?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  lastSeenMessageCount?: Maybe<Scalars['Int']['output']>;
  mcpDisabled?: Maybe<Scalars['Boolean']['output']>;
  messageCount?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  parentSessionKey?: Maybe<Scalars['String']['output']>;
  preview?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  replying?: Maybe<Scalars['Boolean']['output']>;
  sandboxEnabled?: Maybe<Scalars['Boolean']['output']>;
  sandboxImage?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Int']['output']>;
  worktreeBranch?: Maybe<Scalars['String']['output']>;
};

export type SessionMutation = {
  __typename?: 'SessionMutation';
  /** Clear all sessions. */
  clearAll: BoolResult;
  /** Compact all sessions. */
  compact: BoolResult;
  /** Delete a session. */
  delete: BoolResult;
  /** Fork session to new session. */
  fork: BoolResult;
  /** Patch session metadata. */
  patch: BoolResult;
  /** Reset session history. */
  reset: BoolResult;
  /** Create a shareable session link. */
  shareCreate: SessionShareResult;
  /** Revoke a shared session link. */
  shareRevoke: BoolResult;
  /** Switch active session. */
  switch: BoolResult;
};


export type SessionMutationCompactArgs = {
  key?: InputMaybe<Scalars['String']['input']>;
};


export type SessionMutationDeleteArgs = {
  key: Scalars['String']['input'];
};


export type SessionMutationForkArgs = {
  input: Scalars['JSON']['input'];
};


export type SessionMutationPatchArgs = {
  input: Scalars['JSON']['input'];
};


export type SessionMutationResetArgs = {
  key: Scalars['String']['input'];
};


export type SessionMutationShareCreateArgs = {
  input: Scalars['JSON']['input'];
};


export type SessionMutationShareRevokeArgs = {
  shareId: Scalars['String']['input'];
};


export type SessionMutationSwitchArgs = {
  key: Scalars['String']['input'];
};

export type SessionQuery = {
  __typename?: 'SessionQuery';
  /** Whether this session has an active run (LLM is responding). */
  active: SessionActiveResult;
  /** Get session branches. */
  branches: Array<SessionBranch>;
  /** List all sessions. */
  list: Array<SessionEntry>;
  /** Preview a session without switching. */
  preview: SessionEntry;
  /** Resolve or auto-create a session. */
  resolve: SessionEntry;
  /** Search sessions by query. */
  search: Array<SessionEntry>;
  /** List shared session links. */
  shares: Array<SessionShareResult>;
};


export type SessionQueryActiveArgs = {
  sessionKey: Scalars['String']['input'];
};


export type SessionQueryBranchesArgs = {
  key?: InputMaybe<Scalars['String']['input']>;
};


export type SessionQueryPreviewArgs = {
  key: Scalars['String']['input'];
};


export type SessionQueryResolveArgs = {
  key: Scalars['String']['input'];
};


export type SessionQuerySearchArgs = {
  query: Scalars['String']['input'];
};


export type SessionQuerySharesArgs = {
  key?: InputMaybe<Scalars['String']['input']>;
};

export type SessionShareResult = {
  __typename?: 'SessionShareResult';
  accessKey?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  notice?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  revokedAt?: Maybe<Scalars['Int']['output']>;
  sessionKey?: Maybe<Scalars['String']['output']>;
  snapshotMessageCount?: Maybe<Scalars['Int']['output']>;
  views?: Maybe<Scalars['Int']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
};

export type SkillInfo = {
  __typename?: 'SkillInfo';
  description?: Maybe<Scalars['String']['output']>;
  eligible?: Maybe<Scalars['Boolean']['output']>;
  license?: Maybe<Scalars['String']['output']>;
  missingBins?: Maybe<Array<Scalars['String']['output']>>;
  name?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Scalars['String']['output']>;
  protected?: Maybe<Scalars['Boolean']['output']>;
  source?: Maybe<Scalars['JSON']['output']>;
};

export type SkillRepo = {
  __typename?: 'SkillRepo';
  commitSha?: Maybe<Scalars['String']['output']>;
  enabledCount?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  installedAtMs?: Maybe<Scalars['Int']['output']>;
  repoName?: Maybe<Scalars['String']['output']>;
  skillCount?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
};

export type SkillsMutation = {
  __typename?: 'SkillsMutation';
  disable: BoolResult;
  emergencyDisable: BoolResult;
  enable: BoolResult;
  install: BoolResult;
  installDep: BoolResult;
  remove: BoolResult;
  reposRemove: BoolResult;
  trust: BoolResult;
  update: BoolResult;
};


export type SkillsMutationDisableArgs = {
  name: Scalars['String']['input'];
};


export type SkillsMutationEnableArgs = {
  name: Scalars['String']['input'];
};


export type SkillsMutationInstallArgs = {
  input: Scalars['JSON']['input'];
};


export type SkillsMutationInstallDepArgs = {
  input: Scalars['JSON']['input'];
};


export type SkillsMutationRemoveArgs = {
  source: Scalars['String']['input'];
};


export type SkillsMutationReposRemoveArgs = {
  source: Scalars['String']['input'];
};


export type SkillsMutationTrustArgs = {
  name: Scalars['String']['input'];
};


export type SkillsMutationUpdateArgs = {
  name: Scalars['String']['input'];
};

export type SkillsQuery = {
  __typename?: 'SkillsQuery';
  /** Get skills binaries. */
  bins: Scalars['JSON']['output'];
  /** Get skill details. */
  detail: SkillInfo;
  /** List installed skills. */
  list: Array<SkillInfo>;
  /** List skill repositories. */
  repos: Array<SkillRepo>;
  /** Run security scan. */
  securityScan: SecurityScanResult;
  /** Get security status. */
  securityStatus: SecurityStatus;
  /** Get skills system status. */
  status: BoolResult;
};


export type SkillsQueryDetailArgs = {
  name: Scalars['String']['input'];
};

export type StatusInfo = {
  __typename?: 'StatusInfo';
  connections?: Maybe<Scalars['Int']['output']>;
  hostname?: Maybe<Scalars['String']['output']>;
  uptimeMs?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type SttMutation = {
  __typename?: 'SttMutation';
  setProvider: BoolResult;
  transcribe: TranscriptionResult;
};


export type SttMutationSetProviderArgs = {
  provider: Scalars['String']['input'];
};


export type SttMutationTranscribeArgs = {
  input: Scalars['JSON']['input'];
};

export type SttQuery = {
  __typename?: 'SttQuery';
  /** Get available STT providers. */
  providers: Array<ProviderInfo>;
  /** Get STT status. */
  status: SttStatus;
};

export type SttStatus = {
  __typename?: 'SttStatus';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  /** All events (unfiltered, for debugging). */
  allEvents: GenericEvent;
  /** Execution approval events. */
  approvalEvent: GenericEvent;
  /** Channel events. */
  channelEvent: GenericEvent;
  /** Chat events (streaming tokens, completion, abort). */
  chatEvent: GenericEvent;
  /** Config change events. */
  configChanged: GenericEvent;
  /** Cron job notifications (created, updated, removed, run complete). */
  cronNotification: GenericEvent;
  /** Log entry events. */
  logEntry: GenericEvent;
  /** MCP server status change events. */
  mcpStatusChanged: GenericEvent;
  /** Metrics update events. */
  metricsUpdate: GenericEvent;
  /** Node connect/disconnect events. */
  nodeEvent: GenericEvent;
  /** System presence change events. */
  presenceChanged: GenericEvent;
  /** Session change events (patch, switch, delete). */
  sessionChanged: GenericEvent;
  /** Skills install progress events. */
  skillsInstallProgress: GenericEvent;
  /** System tick events (periodic heartbeat with stats). */
  tick: TickEvent;
  /** Update availability events. */
  updateAvailable: GenericEvent;
  /** Voice config changed events. */
  voiceConfigChanged: GenericEvent;
};


export type SubscriptionRootChatEventArgs = {
  sessionKey?: InputMaybe<Scalars['String']['input']>;
};

export type SystemMutation = {
  __typename?: 'SystemMutation';
  /** Broadcast a system event. */
  event: BoolResult;
  /** Touch activity timestamp. */
  setHeartbeats: BoolResult;
  /** Set talk mode. */
  talkMode: BoolResult;
  /** Check for and run updates. */
  updateRun: BoolResult;
  /** Trigger wake functionality. */
  wake: BoolResult;
};


export type SystemMutationEventArgs = {
  event: Scalars['String']['input'];
  payload?: InputMaybe<Scalars['JSON']['input']>;
};


export type SystemMutationTalkModeArgs = {
  mode: Scalars['String']['input'];
};

export type SystemPresence = {
  __typename?: 'SystemPresence';
  clients: Array<ClientInfo>;
  nodes: Array<NodeInfo>;
};

export type SystemQuery = {
  __typename?: 'SystemQuery';
  /** Last activity duration for the current client. */
  lastHeartbeat: BoolResult;
  /** Detailed client and node presence information. */
  presence: SystemPresence;
};

/** System heartbeat tick event with timestamp and memory stats. */
export type TickEvent = {
  __typename?: 'TickEvent';
  /** Memory usage statistics. */
  mem: MemoryStats;
  /** Unix timestamp in milliseconds. */
  ts: Scalars['Int']['output'];
};

export type TranscriptionResult = {
  __typename?: 'TranscriptionResult';
  confidence?: Maybe<Scalars['Float']['output']>;
  durationSeconds?: Maybe<Scalars['Float']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  words?: Maybe<Array<TranscriptionWord>>;
};

export type TranscriptionWord = {
  __typename?: 'TranscriptionWord';
  end?: Maybe<Scalars['Float']['output']>;
  start?: Maybe<Scalars['Float']['output']>;
  word?: Maybe<Scalars['String']['output']>;
};

export type TtsConvertResult = {
  __typename?: 'TtsConvertResult';
  audio?: Maybe<Scalars['String']['output']>;
  durationMs?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

export type TtsMutation = {
  __typename?: 'TtsMutation';
  convert: TtsConvertResult;
  disable: BoolResult;
  enable: BoolResult;
  setProvider: BoolResult;
};


export type TtsMutationConvertArgs = {
  audio: Scalars['String']['input'];
};


export type TtsMutationEnableArgs = {
  input: Scalars['JSON']['input'];
};


export type TtsMutationSetProviderArgs = {
  provider: Scalars['String']['input'];
};

export type TtsQuery = {
  __typename?: 'TtsQuery';
  /** Generate a TTS test phrase. */
  generatePhrase: Scalars['String']['output'];
  /** Get available TTS providers. */
  providers: Array<ProviderInfo>;
  /** Get TTS status. */
  status: TtsStatus;
};

export type TtsStatus = {
  __typename?: 'TtsStatus';
  enabled?: Maybe<Scalars['Boolean']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
};

export type UsageCost = {
  __typename?: 'UsageCost';
  cost?: Maybe<Scalars['Float']['output']>;
};

export type UsageQuery = {
  __typename?: 'UsageQuery';
  /** Calculate cost for a usage period. */
  cost: UsageCost;
  /** Get usage statistics. */
  status: UsageStatus;
};

export type UsageStatus = {
  __typename?: 'UsageStatus';
  sessionCount?: Maybe<Scalars['Int']['output']>;
  totalInputTokens?: Maybe<Scalars['Int']['output']>;
  totalOutputTokens?: Maybe<Scalars['Int']['output']>;
};

export type VoiceConfig = {
  __typename?: 'VoiceConfig';
  stt?: Maybe<VoiceSttConfig>;
  tts?: Maybe<VoiceTtsConfig>;
};

export type VoiceMutation = {
  __typename?: 'VoiceMutation';
  channelOverrideClear: BoolResult;
  channelOverrideSet: BoolResult;
  removeKey: BoolResult;
  saveKey: BoolResult;
  saveSettings: BoolResult;
  sessionOverrideClear: BoolResult;
  sessionOverrideSet: BoolResult;
  toggleProvider: BoolResult;
};


export type VoiceMutationChannelOverrideClearArgs = {
  channelKey: Scalars['String']['input'];
};


export type VoiceMutationChannelOverrideSetArgs = {
  input: Scalars['JSON']['input'];
};


export type VoiceMutationRemoveKeyArgs = {
  provider: Scalars['String']['input'];
};


export type VoiceMutationSaveKeyArgs = {
  input: Scalars['JSON']['input'];
};


export type VoiceMutationSaveSettingsArgs = {
  settings: Scalars['JSON']['input'];
};


export type VoiceMutationSessionOverrideClearArgs = {
  sessionKey: Scalars['String']['input'];
};


export type VoiceMutationSessionOverrideSetArgs = {
  input: Scalars['JSON']['input'];
};


export type VoiceMutationToggleProviderArgs = {
  input: Scalars['JSON']['input'];
};

export type VoiceQuery = {
  __typename?: 'VoiceQuery';
  /** Get voice configuration. */
  config: VoiceConfig;
  /** Fetch ElevenLabs voice catalog. */
  elevenlabsCatalog: Scalars['JSON']['output'];
  /** Get all voice providers with availability detection. */
  providers: Array<ProviderInfo>;
  /** Check Voxtral local setup requirements. */
  voxtralRequirements: VoxtralRequirements;
};

export type VoiceSttConfig = {
  __typename?: 'VoiceSttConfig';
  deepgramConfigured?: Maybe<Scalars['Boolean']['output']>;
  elevenlabsConfigured?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  googleConfigured?: Maybe<Scalars['Boolean']['output']>;
  groqConfigured?: Maybe<Scalars['Boolean']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  sherpaOnnxConfigured?: Maybe<Scalars['Boolean']['output']>;
  whisperCliConfigured?: Maybe<Scalars['Boolean']['output']>;
  whisperConfigured?: Maybe<Scalars['Boolean']['output']>;
};

export type VoiceTtsConfig = {
  __typename?: 'VoiceTtsConfig';
  elevenlabsConfigured?: Maybe<Scalars['Boolean']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  openaiConfigured?: Maybe<Scalars['Boolean']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
};

export type VoicewakeConfig = {
  __typename?: 'VoicewakeConfig';
  enabled?: Maybe<Scalars['Boolean']['output']>;
};

export type VoicewakeMutation = {
  __typename?: 'VoicewakeMutation';
  set: BoolResult;
};


export type VoicewakeMutationSetArgs = {
  input: Scalars['JSON']['input'];
};

export type VoicewakeQuery = {
  __typename?: 'VoicewakeQuery';
  /** Get wake word configuration. */
  get: VoicewakeConfig;
};

export type VoxtralCudaStatus = {
  __typename?: 'VoxtralCudaStatus';
  available?: Maybe<Scalars['Boolean']['output']>;
  gpuName?: Maybe<Scalars['String']['output']>;
  memoryMb?: Maybe<Scalars['Int']['output']>;
  sufficient?: Maybe<Scalars['Boolean']['output']>;
};

export type VoxtralPythonStatus = {
  __typename?: 'VoxtralPythonStatus';
  available?: Maybe<Scalars['Boolean']['output']>;
  sufficient?: Maybe<Scalars['Boolean']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type VoxtralRequirements = {
  __typename?: 'VoxtralRequirements';
  arch?: Maybe<Scalars['String']['output']>;
  compatible?: Maybe<Scalars['Boolean']['output']>;
  cuda?: Maybe<VoxtralCudaStatus>;
  os?: Maybe<Scalars['String']['output']>;
  python?: Maybe<VoxtralPythonStatus>;
  reasons?: Maybe<Array<Scalars['String']['output']>>;
};

export type SessionFieldsFragment = { __typename?: 'SessionEntry', id?: string | null, key?: string | null, label?: string | null, model?: string | null, preview?: string | null, createdAt?: number | null, updatedAt?: number | null, messageCount?: number | null, lastSeenMessageCount?: number | null, archived?: boolean | null } & { ' $fragmentName'?: 'SessionFieldsFragment' };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String']['input'];
  sessionKey?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
}>;


export type SendMessageMutation = { __typename?: 'MutationRoot', chat: { __typename?: 'ChatMutation', send: { __typename?: 'BoolResult', ok: boolean } } };

export type UpdateUserLocationMutationVariables = Exact<{
  input: Scalars['JSON']['input'];
}>;


export type UpdateUserLocationMutation = { __typename?: 'MutationRoot', agents: { __typename?: 'AgentMutation', updateIdentity: { __typename?: 'BoolResult', ok: boolean } } };

export type FetchModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchModelsQuery = { __typename?: 'QueryRoot', models: { __typename?: 'ModelQuery', list: Array<{ __typename?: 'ModelInfo', id?: string | null, name?: string | null, provider?: string | null }> } };

export type FetchSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchSessionsQuery = { __typename?: 'QueryRoot', sessions: { __typename?: 'SessionQuery', list: Array<(
      { __typename?: 'SessionEntry' }
      & { ' $fragmentRefs'?: { 'SessionFieldsFragment': SessionFieldsFragment } }
    )> } };

export type SearchSessionsQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchSessionsQuery = { __typename?: 'QueryRoot', sessions: { __typename?: 'SessionQuery', search: Array<(
      { __typename?: 'SessionEntry' }
      & { ' $fragmentRefs'?: { 'SessionFieldsFragment': SessionFieldsFragment } }
    )> } };

export type FetchStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchStatusQuery = { __typename?: 'QueryRoot', status: { __typename?: 'StatusInfo', hostname?: string | null, version?: string | null, connections?: number | null, uptimeMs?: number | null } };

export type TickSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TickSubscription = { __typename?: 'SubscriptionRoot', tick: { __typename?: 'TickEvent', ts: number } };

export const SessionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SessionEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenMessageCount"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]} as unknown as DocumentNode<SessionFieldsFragment, unknown>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sessionKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"model"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"send"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"sessionKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sessionKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"model"},"value":{"kind":"Variable","name":{"kind":"Name","value":"model"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const UpdateUserLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIdentity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserLocationMutation, UpdateUserLocationMutationVariables>;
export const FetchModelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"models"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}}]}}]}}]}}]} as unknown as DocumentNode<FetchModelsQuery, FetchModelsQueryVariables>;
export const FetchSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SessionEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenMessageCount"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]} as unknown as DocumentNode<FetchSessionsQuery, FetchSessionsQueryVariables>;
export const SearchSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchSessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SessionEntry"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenMessageCount"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]} as unknown as DocumentNode<SearchSessionsQuery, SearchSessionsQueryVariables>;
export const FetchStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"connections"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeMs"}}]}}]}}]} as unknown as DocumentNode<FetchStatusQuery, FetchStatusQueryVariables>;
export const TickDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"Tick"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tick"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ts"}}]}}]}}]} as unknown as DocumentNode<TickSubscription, TickSubscriptionVariables>;