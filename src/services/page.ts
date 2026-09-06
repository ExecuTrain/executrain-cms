import AxiosClient from '@/lib/axios'

// ===== Page Content (CMS) — halaman statis compro (About, dst.) =====

export async function PageDetailService(code: string) {
  try {
    const { data: response } = await AxiosClient.get(`/page/detail/${code}`)

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.log(error)
    return error?.response?.data
  }
}

export async function UpdatePageService(code: string, payload: any) {
  try {
    const { data: response } = await AxiosClient.put(
      `/page/adjust/${code}`,
      payload,
    )

    const { status, message, data } = response

    if (status !== 200) throw new Error(message)

    return { status, message, data }
  } catch (error: any) {
    console.log(error)
    return error?.response?.data
  }
}
