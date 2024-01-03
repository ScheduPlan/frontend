import React, { useEffect, useState } from 'react'

export default function sortItems(objects, itemFilter) {

  return (
    objects.sort(function (a, b) {
        if (a[itemFilter] < b[itemFilter]) { return -1; }
        if (a[itemFilter] > b[itemFilter]) { return 1; }
        return 0;
      })
  )
}