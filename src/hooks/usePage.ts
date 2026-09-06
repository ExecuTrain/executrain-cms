import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'

import {
  PageDetailService,
  UpdatePageService,
} from '@/services/page'

/** Ambil konten satu halaman statis (mis. code "about"). */
export const usePageDetail = (code: string): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['page-detail', code],
    queryFn: async () => {
      try {
        const { data, status } = await PageDetailService(code)
        if (status !== 200) throw new Error()
        return data
      } catch (e) {
        return null
      }
    },
    refetchOnWindowFocus: false,
  })
}

/** Simpan konten satu halaman statis (create/update by code). */
export const useUpdatePage = (code: string) => {
  return useMutation({
    mutationKey: ['update_page', code],
    mutationFn: async (payload: any) => {
      try {
        const response: any = await UpdatePageService(code, payload)
        if (response.status !== 200) throw new Error(response.message)
        return { data: response.data }
      } catch (error: any) {
        throw new Error(error.message || `Failed to update page ${code}`)
      }
    },
  })
}
