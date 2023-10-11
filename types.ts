export type Stored<T> = T & {
  storedAt: string
  revalidatedAt: string
}

export type Action = {
  guid: string
  name: string
  description: string
  prompt: string
  createdById: string
  model: string
  app: string
  createdAt: string
  updatedAt: string
  variables: string[]
}

export type StoredAction = Stored<Action>

export type ActionResponse = {
  msg: string
  data_guid: string
  feedbackUrl: string
  streaming: boolean
  actionGuid: string
  input: string
  isPositive?: boolean
  isNegative?: boolean
}

export type StoredActionResponse = Omit<Stored<ActionResponse>, "revalidatedAt">
