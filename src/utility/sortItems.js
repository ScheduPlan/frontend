import React, { useEffect, useState } from 'react'

export default function sortItems(objects, sort1, sort2) {

  return (
    sort2 != null ?
      objects.sort(function (a, b) {
        if (a[sort1][sort2] < b[sort1][sort2]) { return -1; }
        if (a[sort1][sort2] > b[sort1][sort2]) { return 1; }
        return 0;
      }) :
      objects.sort(function (a, b) {
        if (a[sort1] < b[sort1]) { return -1; }
        if (a[sort1] > b[sort1]) { return 1; }
        return 0;
      })
  )
}