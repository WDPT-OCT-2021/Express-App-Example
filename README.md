                                          APP PLANNING

## app ideas ?

-   1. travel app
       x 2. waring countries
       x 3. Bucket list
       x 4. Cloths Shopping List
       x 5. Site Seeing List
       x 6. Restaurants Around the World
       x 7. Car Import List
       x 8. Where did famous people die? or Live? (Information App)
       x 9. Best Location to get Wigs, Glasses, Lipsticks, Nails, Horses, Paper, Books, etc.
       x 10. todo list

---

## API

1. restcountries
2. country layer

---

## Models

user {
username: string
password: string
travelLocations: [Schema.Types.ObjectId, ref: 'Trip']
}

task {
title: string
description: string
duration: string
createdDate: Date
isCompleted: boolean
}

trip {
location: string
tasksIWillDoAtSaidLocation: [Schema.Types.ObjectId, ref: 'Task']
travelStartDate: Date
travelEndDate: Date
cost: string
locationsToVisit: [Schema.Types.ObjectId, ref: 'locationToVisitOnTrip']
afterTripThoughts: [Schema.Types.ObjectId, ref: 'Comment']
}

locationToVisitOnTrip {
name: string
description: string
address: {
streetAddress: string
city: string
state-region: string
}

  <!-- address: [Schema.Types.ObjectId, ref: 'Address'] -->

comments: [Schema.Types.ObjectId, ref: 'Comment']
}

<!-- address {
  streetAddress: string
  city: string
  state-region: string
} -->

comment {
comment: string
author: [Schema.Types.ObjectId, ref: 'User']
likes: [Schema.Types.ObjectId, ref: 'User']
replies: [Schema.Types.ObjectId, ref: 'Comment']
}

travelCollogue {
author: [Schema.Types.ObjectId, ref: 'User']
title: string
trips: [Schema.Types.ObjectId, ref: 'Trip']
memories: [Schema.Types.ObjectId, ref: 'Comment']
}

---
