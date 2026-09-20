/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Shared CV-download logic, extracted so both the Hero (top
 * of the page) and the About tab's own button can trigger the same fetch/
 * blob/download flow without duplicating it (issue #179).
 */

export function useDownloadResume() {
  const store = useResumeStore()
  const isDisabled = ref(false)

  async function downloadResume() {
    const response = await fetch('/api/generate-pdf')

    const { status } = response
    if (status !== 200) {
      isDisabled.value = true
      return
    }

    const blob = await response.blob()
    const link = document.createElement('a')

    link.href = URL.createObjectURL(blob)
    link.download = `${store.hero.email || 'download'}.pdf`
    link.click()
  }

  return { downloadResume, isDisabled }
}
