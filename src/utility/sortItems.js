export default function sortItems(objects, sort1, sort2, sort3) {

  if (sort2 != null ) {
    if(sort3 != null) {
      return (
        objects.sort(function (a, b) {
          if (a[sort1][sort2][sort3] < b[sort1][sort2][sort3]) { return -1; }
          if (a[sort1][sort2][sort3] > b[sort1][sort2][sort3]) { return 1; }
          return 0;
        })
      )
    } else {
      return (
        objects.sort(function (a, b) {
          if (a[sort1][sort2] < b[sort1][sort2]) { return -1; }
          if (a[sort1][sort2] > b[sort1][sort2]) { return 1; }
          return 0;
        })
      )
    }
  } else {
    return (
      objects.sort(function (a, b) {
        if (a[sort1] < b[sort1]) { return -1; }
        if (a[sort1] > b[sort1]) { return 1; }
        return 0;
      })
    )
  }
}