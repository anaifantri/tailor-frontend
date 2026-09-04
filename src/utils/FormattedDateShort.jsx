export default function FormattedDateShort(date) {
    const months = [
        null,
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
    ];
    let getDate = new Date(date);
    const formatter =
        getDate.getDate() +
        "-" +
        months[parseInt(getDate.getMonth() + 1)] +
        "-" +
        getDate.getFullYear();
    return formatter;
}
