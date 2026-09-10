import AxiosClient from '@/lib/axios'

export interface ArticlePayload {
  title: string
  banner: {
    url: string
    public_id: string
  } | null
  category: string[]
  content: string
}

export async function ArticleListService(search?: string) {
  try {
    const params = search ? { search } : {}

    const { data: response } = await AxiosClient.get('/article', {
      params,
    })

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 500, message: 'Failed to fetch Articles', data: [] }
  }
}

export async function ArticleDetailService(id: string) {
  try {
    const { data: response } = await AxiosClient.get(`/article/${id}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return { status: 404, message: 'Article not found', data: null }
  }
}

export async function ArticleCreateService(payload: ArticlePayload) {
  try {
    const { data: response } = await AxiosClient.post('/article', payload)

    const { status, message, data } = response

    if (status !== 201) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ArticleUpdateService(
  id: string,
  payload: ArticlePayload,
) {
  try {
    const { data: response } = await AxiosClient.put(
      `/article/${id}`,
      payload,
    )

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
      data,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

export async function ArticleDeleteService(id: string) {
  try {
    const { data: response } = await AxiosClient.delete(`/article/${id}`)

    const { status, message } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}

/**
 * Hapus gambar dari storage (Azure Blob) — dipakai untuk cleanup
 * gambar yang dihapus/diganti dari konten artikel.
 */
export async function ArticleImageDeleteService(url: string) {
  try {
    const { data: response } = await AxiosClient.delete('/upload', {
      params: { url },
    })

    const { status, message } = response

    if (status !== 200) throw new Error(message)

    return {
      status,
      message,
    }
  } catch (error: any) {
    console.error(error)
    return error?.response?.data
  }
}
