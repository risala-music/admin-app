"use client"

import { create } from "zustand"
import type { AppState, Commission, District, Group, Band, Member } from "./types"
import { getSupabase } from "./supabase"

interface AppStore extends AppState {
  isLoading: boolean
  error: string | null

  // Fetch actions
  fetchCommissions: () => Promise<void>
  fetchDistricts: () => Promise<void>
  fetchGroups: () => Promise<void>
  fetchBands: () => Promise<void>
  fetchMembers: () => Promise<void>
  fetchAll: () => Promise<void>

  // Commission actions
  addCommission: (commission: Omit<Commission, "id" | "createdAt">) => Promise<void>
  updateCommission: (id: string, commission: Partial<Commission>) => Promise<void>
  deleteCommission: (id: string) => Promise<void>

  // District actions
  addDistrict: (district: Omit<District, "id" | "createdAt">) => Promise<void>
  updateDistrict: (id: string, district: Partial<District>) => Promise<void>
  deleteDistrict: (id: string) => Promise<void>

  // Group actions
  addGroup: (group: Omit<Group, "id" | "createdAt">) => Promise<void>
  updateGroup: (id: string, group: Partial<Group>) => Promise<void>
  deleteGroup: (id: string) => Promise<void>

  // Band actions
  addBand: (band: Omit<Band, "id" | "createdAt">) => Promise<void>
  updateBand: (id: string, band: Partial<Band>) => Promise<void>
  deleteBand: (id: string) => Promise<void>

  // Member actions
  addMember: (member: Omit<Member, "id" | "createdAt">) => Promise<void>
  updateMember: (id: string, member: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>
}

export const useStore = create<AppStore>()((set, get) => ({
  commissions: [],
  districts: [],
  groups: [],
  bands: [],
  members: [],
  isLoading: false,
  error: null,

  // Fetch actions
  fetchCommissions: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { data, error } = await supabase.from('commission').select('id,name_ar,name_en')
      if (error) throw error

      set({
        commissions: data.map((c) => ({
          id: c.id,
          name_ar: c.name_ar,
          name_en: c.name_en,
          // createdAt: c.created_at,
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchDistricts: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()

      const { data, error } = await supabase
        .from("district")
        .select(`
          *,
          commission (
            id,
            name_ar
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      set({
        districts: data.map((d) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          commissionName: d.commission.name_ar,
          commissionId: d.commission.id,
          // createdAt: d.created_at,
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchGroups: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { data, error } = await supabase.from("group")
        .select(`
          *,
          commission (
            id,
            name_ar
          ),
          district (
            id,
            name
          )
        `)
      .order("created_at", { ascending: false })
      if (error) throw error

      set({
        groups: data.map((g) => ({
          id: g.id,
          name: g.name,
          town_name: g.town_name,
          districtName: g.district.name,
          districtId: g.district.id,
          commissionName: g.commission.name_ar,
          commissionId: g.commission.id,
          // createdAt: g.created_at,
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchBands: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { data, error } = await supabase.from("band").select(`
        *,
        district (
          id,
          name
        ),
        commission (
          id,
          name_ar
        ),
        group (
          id,
          town_name
        )
      `).order("created_at", { ascending: false })

      if (error) throw error
      set({
        bands: data.map((b) => ({
          id: b.id,
          name: b.name,
          town_name: b.town_name,
          code: b.code,
          groupId: b.group_id,
          groupName: b.group?.town_name,
          districtId: b.district.id,
          districtName: b.district.name,
          commissionId: b.commission.id,
          commissionName: b.commission.name_ar,
          createdAt: b.created_at,
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchMembers: async () => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("member")
        .select("*")
        .order("created_at", { ascending: false })

      if (membersError) throw membersError

      // Fetch band memberships
      const { data: membershipsData, error: membershipsError } = await supabase
        .from("band_member")
        .select("member_id, band_id")

      if (membershipsError) throw membershipsError

      // Map band IDs to members
      const memberBands = new Map<string, string[]>()
      membershipsData?.forEach((m) => {
        const existing = memberBands.get(m.member_id) || []
        memberBands.set(m.member_id, [...existing, m.band_id])
      })

      set({
        members: membersData.map((m) => ({
          id: m.id,
          name: m.name,
          code: m.code,
          civilId: m.civil_id,
          phoneNumber: m.phone_number,
          bandIds: memberBands.get(m.id) || [],
          createdAt: m.created_at,
        })),
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchAll: async () => {
    const { fetchCommissions, fetchDistricts, fetchGroups, fetchBands, fetchMembers } = get()
    await Promise.all([fetchCommissions(), fetchDistricts(), fetchGroups(), fetchBands(), fetchMembers()])
  },

  // Commission actions
  addCommission: async (commission) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("commission").insert([{ name: commission.name, code: commission.code }])

      if (error) throw error

      await get().fetchCommissions()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateCommission: async (id, commission) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("commission").update(commission).eq("id", id)

      if (error) throw error

      await get().fetchCommissions()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteCommission: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("commission").delete().eq("id", id)

      if (error) throw error

      await get().fetchCommissions()
      await get().fetchDistricts() // Refresh cascaded deletes
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // District actions
  addDistrict: async (district) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("district").insert([
        {
          name: district.name,
          code: district.code,
          commission_id: district.commissionId,
        },
      ])

      if (error) throw error

      await get().fetchDistricts()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateDistrict: async (id, district) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const updateData: any = {}
      if (district.name) updateData.name = district.name
      if (district.code) updateData.code = district.code
      if (district.commissionId) updateData.commission_id = district.commissionId

      const { error } = await supabase.from("district").update(updateData).eq("id", id)

      if (error) throw error

      await get().fetchDistricts()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteDistrict: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("district").delete().eq("id", id)

      if (error) throw error

      await get().fetchDistricts()
      await get().fetchGroups() // Refresh cascaded deletes
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Group actions
  addGroup: async (group) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("group").insert([
        {
          name: group.name,
          code: group.code,
          district_id: group.districtId,
        },
      ])

      if (error) throw error

      await get().fetchGroups()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateGroup: async (id, group) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const updateData: any = {}
      if (group.name) updateData.name = group.name
      if (group.town_name) updateData.town_name = group.town_name
      // if (group.code) updateData.code = group.code
      if (group.districtId) updateData.district_id = group.districtId
      if (group.commissionId) updateData.commission_id = group.commissionId

      const { error } = await supabase.from("group").update(updateData).eq("id", id)

      if (error) throw error

      await get().fetchGroups()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteGroup: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("group").delete().eq("id", id)

      if (error) throw error

      await get().fetchGroups()
      await get().fetchBands() // Refresh cascaded deletes
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Band actions
  addBand: async (band) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("band").insert([
        {
          name: band.name,
          // code: band.code,
          town_name: band.town_name,
          district_id: band.districtId,
          commission_id: band.commissionId,
          group_id: band.groupId,
        },
      ])

      if (error) throw error

      await get().fetchBands()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateBand: async (id, band) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const updateData: any = {}
      if (band.name) updateData.name = band.name
      if (band.code) updateData.code = band.code
      if (band.groupId) updateData.group_id = band.groupId

      const { error } = await supabase.from("band").update(updateData).eq("id", id)

      if (error) throw error

      await get().fetchBands()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteBand: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("band").delete().eq("id", id)

      if (error) throw error

      await get().fetchBands()
      await get().fetchMembers() // Refresh to update band memberships
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Member actions
  addMember: async (member) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()

      // Insert member
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert([
          {
            name: member.name,
            code: member.code,
            civil_id: member.civilId,
            phone_number: member.phoneNumber,
          },
        ])
        .select()
        .single()

      if (memberError) throw memberError

      // Insert band memberships
      if (member.bandIds && member.bandIds.length > 0) {
        const memberships = member.bandIds.map((bandId) => ({
          member_id: memberData.id,
          band_id: bandId,
        }))

        const { error: membershipsError } = await supabase.from("band_member").insert(memberships)

        if (membershipsError) throw membershipsError
      }

      await get().fetchMembers()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updateMember: async (id, member) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()

      // Update member basic info
      const updateData: any = {}
      if (member.name) updateData.name = member.name
      if (member.code) updateData.code = member.code
      if (member.civilId) updateData.civil_id = member.civilId
      if (member.phoneNumber) updateData.phone_number = member.phoneNumber

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase.from("member").update(updateData).eq("id", id)

        if (error) throw error
      }

      // Update band memberships if provided
      if (member.bandIds !== undefined) {
        // Delete existing memberships
        await supabase.from("band_member").delete().eq("member_id", id)

        // Insert new memberships
        if (member.bandIds.length > 0) {
          const memberships = member.bandIds.map((bandId) => ({
            member_id: id,
            band_id: bandId,
          }))

          const { error: membershipsError } = await supabase.from("band_member").insert(memberships)

          if (membershipsError) throw membershipsError
        }
      }

      await get().fetchMembers()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deleteMember: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const supabase = getSupabase()
      const { error } = await supabase.from("member").delete().eq("id", id)

      if (error) throw error

      await get().fetchMembers()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
