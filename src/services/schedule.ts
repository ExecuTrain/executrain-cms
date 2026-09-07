import AxiosClient from '@/lib/axios'

export interface SchedulePayload {
  entity_type?: 'COURSE' | 'SKILL_ACCELERATOR'
  entity_id?: string
  schedule_date?: string
  program_name?: string
}

/** Buat rentang tanggal (disimpan per tanggal oleh backend). */
export async function ScheduleRangeCreateService(payload: {
  entity_type: 'COURSE' | 'SKILL_ACCELERATOR'
  entity_id: string
  start_date: string
  end_date: string
}) {
  try {
    const { data: response } = await AxiosClient.post('/schedule/range', payload)
    const { status, message, data } = response
    if (status !== 201) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/** Ganti rentang tanggal lama (replace_ids) dgn rentang baru. */
export async function ScheduleRangeUpdateService(
  id: string,
  payload: {
    entity_type?: 'COURSE' | 'SKILL_ACCELERATOR'
    entity_id?: string
    start_date: string
    end_date: string
    replace_ids?: string[]
  },
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/schedule/adjust-range/${id}`,
      payload,
    )
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/** Daftar schedule utk satu bulan (YYYY-MM). */
export async function ScheduleListService(month: string) {
  try {
    const { data: response } = await AxiosClient.get('/schedule/list', {
      params: { month },
    })
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch schedules', data: [] }
  }
}

/** Opsi program utk dropdown (Course / Skill Accelerator). */
export async function ScheduleOptionsService(type: 'COURSE' | 'SKILL_ACCELERATOR') {
  try {
    const { data: response } = await AxiosClient.get('/schedule/options', {
      params: { type },
    })
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data, meta: response.meta }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch options', data: [], meta: {} }
  }
}

export async function ScheduleDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/schedule/detail/${id}`)
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Schedule not found', data: null }
  }
}

export async function ScheduleCreateService(payload: SchedulePayload) {
  try {
    const { data: response } = await AxiosClient.post('/schedule/add', payload)
    const { status, message, data } = response
    if (status !== 201) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ScheduleUpdateService(id: string, payload: Partial<SchedulePayload>) {
  try {
    const { data: response } = await AxiosClient.put(`/schedule/adjust/${id}`, payload)
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ScheduleDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/schedule/takedown/${id}`)
    const { status, message } = response
    if (status !== 200) throw new Error(message)
    return { status, message }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ScheduleDeleteManyService(ids: string[]) {
  try {
    const { data: response } = await AxiosClient.delete('/schedule/takedown-many', {
      data: { ids },
    })
    const { status, message } = response
    if (status !== 200) throw new Error(message)
    return { status, message }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/** Unduh template Excel (dropdown program) utk type tertentu. */
export async function ScheduleTemplateDownloadService(
  type: 'COURSE' | 'SKILL_ACCELERATOR',
): Promise<{ status: number; message: string; data?: Blob }> {
  try {
    // Akses instance axios (token otomatis di header)
    const response = await AxiosClient.get('/schedule/template', {
      params: { type },
      responseType: 'blob',
    })
    // Bila error (non-200) axios tetap kembalikan blob
    return {
      status: 200,
      message: 'success',
      data: response.data as Blob,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to download template' }
  }
}

/** Preview hasil parse file Excel (belum disimpan). */
export async function ScheduleImportPreviewService(
  type: 'COURSE' | 'SKILL_ACCELERATOR',
  file: File,
) {
  try {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)
    const { data: response } = await AxiosClient.post(
      '/schedule/import/preview',
      formData,
      {
        timeout: 60000,
      },
    )
    const { status, message, data } = response
    if (status !== 200) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/** Simpan baris yang disetujui dari hasil preview. */
export async function ScheduleImportConfirmService(rows: any[]) {
  try {
    const { data: response } = await AxiosClient.post('/schedule/import/confirm', {
      rows,
    })
    const { status, message, data } = response
    if (status !== 201) throw new Error(message)
    return { status, message, data }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}
