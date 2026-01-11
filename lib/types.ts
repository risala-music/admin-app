export interface Commission {
  id: string
  name_ar: string
  code: string
  createdAt: string
}

export interface District {
  id: string
  name: string
  code: string
  commissionId: string
  commissionName: string
  createdAt: string
}

export interface Group {
  id: string
  name: string
  code: string
  town_name: string
  districtId: string
  districtName: string
  commissionId: string
  commissionName: string
  createdAt: string
}

export interface Band {
  id: string
  name: string
  town_name: string
  code: string
  groupId: string
  groupName: string
  districtId: string
  districtName: string
  commissionId: string
  commissionName: string
  createdAt: string
}

export interface Member {
  id: string
  name: string
  code: string
  civilId: string
  phoneNumber: string
  bandIds: string[]
  createdAt: string
}

export interface AppState {
  commissions: Commission[]
  districts: District[]
  groups: Group[]
  bands: Band[]
  members: Member[]
}
