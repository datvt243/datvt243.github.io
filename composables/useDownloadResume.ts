/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description: Shared CV-download logic, extracted so both the Hero (top
 * of the page) and the About tab's own button can trigger the same fetch/
 * blob/download flow without duplicating it (issue #179). Also drives a
 * toast (issue #198) so a slow/cold Puppeteer launch on the server doesn't
 * look like a silently broken button.
 */

export function useDownloadResume() {
  const store = useResumeStore()
  const { t } = useI18n()
  const toast = useToast()
  const isDisabled = ref(false)
  const isLoading = ref(false)

  async function downloadResume() {
    isLoading.value = true
    const notification = toast.add({
      title: t('resume.downloadingCv'),
      icon: 'i-fe-download',
      timeout: 0,
    })

    try {
      const response = await fetch('/api/generate-pdf')

      const { status } = response
      if (status !== 200) {
        isDisabled.value = true
        toast.update(notification.id, {
          title: t('resume.downloadCvError'),
          icon: 'i-fe-warning',
          color: 'red',
          timeout: 5000,
        })
        return
      }

      const blob = await response.blob()
      const link = document.createElement('a')

      link.href = URL.createObjectURL(blob)
      link.download = `${store.hero.email || 'download'}.pdf`
      link.click()

      toast.update(notification.id, {
        title: t('resume.downloadCvSuccess'),
        icon: 'i-fe-check-circle',
        color: 'green',
        timeout: 4000,
      })
    } catch {
      isDisabled.value = true
      toast.update(notification.id, {
        title: t('resume.downloadCvError'),
        icon: 'i-fe-warning',
        color: 'red',
        timeout: 5000,
      })
    } finally {
      isLoading.value = false
    }
  }

  return { downloadResume, isDisabled, isLoading }
}
