export default function FormattedDateLong(date) {
    const months = [
        null,
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];
    let getDate = new Date(date);
    const formattedDate =
        getDate.getDate() +
        " " +
        months[parseInt(getDate.getMonth() + 1)] +
        " " +
        getDate.getFullYear();
    return formattedDate;
}
