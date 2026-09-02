import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'

import {
  PartnerListService,
  CreatePartnerService,
  UpdatePartnerService,
  DeletePartnerService,
  TestimonialListService,
  CreateTestimonialService,
  UpdateTestimonialService,
  DeleteTestimonialService,
  StatisticListService,
  UpdateStatisticService,
  SocmedListService,
  UpdateSocmedService,
  AssetListService,
  UpdateAssetService,
  UpdateAssetUrlService,
  CareerGalleryListService,
  CreateCareerGalleryService,
  UpdateCareerGalleryService,
  DeleteCareerGalleryService,
  GalleryListService,
  CreateGalleryService,
  UpdateGalleryService,
  DeleteGalleryService,
} from '@/services/contentManagement'

// ===== Partner =====
export const usePartner = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['partner-list'],
    queryFn: async () => {
      try {
        const { data, status } = await PartnerListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useCreatePartner = () => {
  return useMutation({
    mutationKey: ['create_partner'],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreatePartnerService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to create partner')
      }
    },
  })
}

export const useUpdatePartner = () => {
  return useMutation({
    mutationKey: ['update_partner'],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdatePartnerService(id, data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update partner')
      }
    },
  })
}

export const useDeletePartner = () => {
  return useMutation({
    mutationKey: ['delete_partner'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeletePartnerService(id)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete partner')
      }
    },
  })
}

// ===== Testimonial =====
export const useTestimonial = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['testimonial-list'],
    queryFn: async () => {
      try {
        const { data, status } = await TestimonialListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useCreateTestimonial = () => {
  return useMutation({
    mutationKey: ['create_testimonial'],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateTestimonialService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to create testimonial')
      }
    },
  })
}

export const useUpdateTestimonial = () => {
  return useMutation({
    mutationKey: ['update_testimonial'],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateTestimonialService(id, data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update testimonial')
      }
    },
  })
}

export const useDeleteTestimonial = () => {
  return useMutation({
    mutationKey: ['delete_testimonial'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteTestimonialService(id)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete testimonial')
      }
    },
  })
}

// ===== Statistic =====
export const useStatistic = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['statistic-detail'],
    queryFn: async () => {
      try {
        const { data, status } = await StatisticListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useUpdateStatistic = () => {
  return useMutation({
    mutationKey: ['update_statistic'],
    mutationFn: async (data: any) => {
      try {
        const response: any = await UpdateStatisticService(data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update statistic')
      }
    },
  })
}

// ===== Socmed =====
export const useSocmed = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['socmed-list'],
    queryFn: async () => {
      try {
        const { data, status } = await SocmedListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useUpdateSocmed = () => {
  return useMutation({
    mutationKey: ['update_socmed'],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateSocmedService(id, data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update social media')
      }
    },
  })
}

// ===== Assets =====
export const useAssets = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['assets-list'],
    queryFn: async () => {
      try {
        const { data, status } = await AssetListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useUpdateAsset = () => {
  return useMutation({
    mutationKey: ['update_asset'],
    mutationFn: async ({ id, payload }: { id: string; payload: FormData }) => {
      try {
        const response: any = await UpdateAssetService(id, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update asset')
      }
    },
  })
}

export const useUpdateAssetUrl = () => {
  return useMutation({
    mutationKey: ['update_asset_url'],
    mutationFn: async ({ id, payload }: { id: string; payload: { url?: string; fallback_url?: string } }) => {
      try {
        const response: any = await UpdateAssetUrlService(id, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update asset')
      }
    },
  })
}

// ===== Career Gallery =====
export const useCareerGallery = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['career-gallery-list'],
    queryFn: async () => {
      try {
        const { data, status } = await CareerGalleryListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useCreateCareerGallery = () => {
  return useMutation({
    mutationKey: ['create_career_gallery'],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateCareerGalleryService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to create gallery')
      }
    },
  })
}

export const useUpdateCareerGallery = () => {
  return useMutation({
    mutationKey: ['update_career_gallery'],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateCareerGalleryService(id, data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update gallery')
      }
    },
  })
}

export const useDeleteCareerGallery = () => {
  return useMutation({
    mutationKey: ['delete_career_gallery'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteCareerGalleryService(id)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete gallery')
      }
    },
  })
}

// ===== Gallery =====
export const useGallery = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['gallery-list'],
    queryFn: async () => {
      try {
        const { data, status } = await GalleryListService()
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

export const useCreateGallery = () => {
  return useMutation({
    mutationKey: ['create_gallery'],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await CreateGalleryService(payload)
        if (response.status !== 201) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to create gallery')
      }
    },
  })
}

export const useUpdateGallery = () => {
  return useMutation({
    mutationKey: ['update_gallery'],
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const response: any = await UpdateGalleryService(id, data)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to update gallery')
      }
    },
  })
}

export const useDeleteGallery = () => {
  return useMutation({
    mutationKey: ['delete_gallery'],
    mutationFn: async (id: string) => {
      try {
        const response: any = await DeleteGalleryService(id)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || 'Failed to delete gallery')
      }
    },
  })
}
