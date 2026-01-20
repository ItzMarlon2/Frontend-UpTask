export function formatDate(isoDate: string) : string {
    const date = new Date(isoDate)
    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    return formatter.format(date)
}