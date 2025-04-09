"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Data for status
const statusData = [
  {
    "name": "Released",
    "value": 302649
  },
  {
    "name": "Post Production",
    "value": 292
  },
  {
    "name": "In Production",
    "value": 253
  },
  {
    "name": "Planned",
    "value": 10
  },
  {
    "name": "Canceled",
    "value": 1
  }
]

// Data for original_language
const languageData = [
  {
    "name": "en",
    "value": 161567
  },
  {
    "name": "Other",
    "value": 29733
  },
  {
    "name": "fr",
    "value": 17306
  },
  {
    "name": "es",
    "value": 15040
  },
  {
    "name": "de",
    "value": 12415
  },
  {
    "name": "ja",
    "value": 12060
  },
  {
    "name": "it",
    "value": 8584
  },
  {
    "name": "ru",
    "value": 6300
  },
  {
    "name": "zh",
    "value": 5356
  },
  {
    "name": "pt",
    "value": 5203
  },
  {
    "name": "hi",
    "value": 4756
  },
  {
    "name": "sv",
    "value": 3203
  },
  {
    "name": "ko",
    "value": 3092
  },
  {
    "name": "cn",
    "value": 2990
  },
  {
    "name": "ta",
    "value": 2433
  },
  {
    "name": "ml",
    "value": 2428
  },
  {
    "name": "tr",
    "value": 2295
  },
  {
    "name": "nl",
    "value": 2214
  },
  {
    "name": "pl",
    "value": 2150
  },
  {
    "name": "ar",
    "value": 2046
  },
  {
    "name": "tl",
    "value": 2034
  }
]

// Data for genres
const genreData = [
  {
    "name": "drama",
    "value": 75211
  },
  {
    "name": "comedy",
    "value": 46626
  },
  {
    "name": "documentary",
    "value": 43088
  },
  {
    "name": "Other",
    "value": 35298
  },
  {
    "name": "action",
    "value": 17132
  },
  {
    "name": "horror",
    "value": 14880
  },
  {
    "name": "thriller",
    "value": 9569
  },
  {
    "name": "crime",
    "value": 9233
  },
  {
    "name": "romance",
    "value": 9159
  },
  {
    "name": "music",
    "value": 6075
  },
  {
    "name": "animation",
    "value": 5737
  },
  {
    "name": "adventure",
    "value": 5714
  },
  {
    "name": "family",
    "value": 4625
  },
  {
    "name": "tv movie",
    "value": 3851
  },
  {
    "name": "western",
    "value": 3813
  },
  {
    "name": "science fiction",
    "value": 3439
  },
  {
    "name": "mystery",
    "value": 2841
  },
  {
    "name": "fantasy",
    "value": 2794
  },
  {
    "name": "war",
    "value": 2121
  },
  {
    "name": "history",
    "value": 1999
  }
]

// Data for production_countries
const countryData = [
  {
    "name": "Other",
    "value": 102758
  },
  {
    "name": "United States Of America",
    "value": 77340
  },
  {
    "name": "United Kingdom",
    "value": 15251
  },
  {
    "name": "France",
    "value": 14710
  },
  {
    "name": "India",
    "value": 12382
  },
  {
    "name": "Japan",
    "value": 12160
  },
  {
    "name": "Germany",
    "value": 11494
  },
  {
    "name": "Canada",
    "value": 9213
  },
  {
    "name": "Italy",
    "value": 7417
  },
  {
    "name": "Spain",
    "value": 4904
  },
  {
    "name": "Mexico",
    "value": 4067
  },
  {
    "name": "Brazil",
    "value": 3923
  },
  {
    "name": "Hong Kong",
    "value": 3839
  },
  {
    "name": "Soviet Union",
    "value": 3772
  },
  {
    "name": "Argentina",
    "value": 3168
  },
  {
    "name": "Sweden",
    "value": 3009
  },
  {
    "name": "South Korea",
    "value": 2920
  },
  {
    "name": "Australia",
    "value": 2861
  },
  {
    "name": "China",
    "value": 2844
  },
  {
    "name": "Russia",
    "value": 2659
  },
  {
    "name": "Philippines",
    "value": 2514
  }
]

// Data for spoken_languages
const spokenLanguageData = [
  {
    "name": "english",
    "value": 119331
  },
  {
    "name": "Other",
    "value": 75207
  },
  {
    "name": "french",
    "value": 15722
  },
  {
    "name": "spanish",
    "value": 14254
  },
  {
    "name": "german",
    "value": 12577
  },
  {
    "name": "japanese",
    "value": 11797
  },
  {
    "name": "italian",
    "value": 7915
  },
  {
    "name": "russian",
    "value": 6158
  },
  {
    "name": "mandarin",
    "value": 5612
  },
  {
    "name": "portuguese",
    "value": 4709
  },
  {
    "name": "hindi",
    "value": 4329
  },
  {
    "name": "arabic",
    "value": 3157
  },
  {
    "name": "no language",
    "value": 3120
  },
  {
    "name": "cantonese",
    "value": 2998
  },
  {
    "name": "korean",
    "value": 2968
  },
  {
    "name": "swedish",
    "value": 2500
  },
  {
    "name": "tamil",
    "value": 2372
  },
  {
    "name": "malayalam",
    "value": 2299
  },
  {
    "name": "dutch",
    "value": 2111
  },
  {
    "name": "turkish",
    "value": 2070
  },
  {
    "name": "polish",
    "value": 1999
  }
]

// Data for runtime histogram
const runtimeData = [
  { bin: "21.0 - 26.58", count: 8299 },
  { bin: "26.58 - 32.16", count: 6497 },
  { bin: "32.16 - 37.74", count: 2055 },
  { bin: "37.74 - 43.32", count: 3084 },
  { bin: "43.32 - 48.9", count: 4675 },
  { bin: "48.9 - 54.48", count: 7702 },
  { bin: "54.48 - 60.06", count: 12924 },
  { bin: "60.06 - 65.64", count: 6811 },
  { bin: "65.64 - 71.22", count: 10796 },
  { bin: "71.22 - 76.8", count: 14546 },
  { bin: "76.8 - 82.38", count: 23607 },
  { bin: "82.38 - 87.96", count: 29962 },
  { bin: "87.96 - 93.54", count: 50937 },
  { bin: "93.54 - 99.12", count: 33124 },
  { bin: "99.12 - 104.7", count: 21201 },
  { bin: "104.7 - 110.28", count: 18226 },
  { bin: "110.28 - 115.86", count: 8773 },
  { bin: "115.86 - 121.44", count: 10113 },
  { bin: "121.44 - 127.02", count: 5691 },
  { bin: "127.02 - 132.6", count: 3911 },
  { bin: "132.6 - 138.18", count: 4056 },
  { bin: "138.18 - 143.76", count: 2849 },
  { bin: "143.76 - 149.34", count: 2617 },
  { bin: "149.34 - 154.92", count: 2181 },
  { bin: "154.92 - 160.5", count: 1888 },
  { bin: "160.5 - 166.08", count: 1219 },
  { bin: "166.08 - 171.66", count: 842 },
  { bin: "171.66 - 177.24", count: 746 },
  { bin: "177.24 - 182.82", count: 1094 },
  { bin: "182.82 - 188.4", count: 367 },
  { bin: "188.4 - 193.98", count: 263 },
  { bin: "193.98 - 199.56", count: 246 },
  { bin: "199.56 - 205.14", count: 302 },
  { bin: "205.14 - 210.72", count: 225 },
  { bin: "210.72 - 216.3", count: 137 },
  { bin: "216.3 - 221.88", count: 139 },
  { bin: "221.88 - 227.46", count: 131 },
  { bin: "227.46 - 233.04", count: 102 },
  { bin: "233.04 - 238.62", count: 79 },
  { bin: "238.62 - 244.2", count: 228 },
  { bin: "244.2 - 249.78", count: 58 },
  { bin: "249.78 - 255.36", count: 77 },
  { bin: "255.36 - 260.94", count: 60 },
  { bin: "260.94 - 266.52", count: 49 },
  { bin: "266.52 - 272.1", count: 64 },
  { bin: "272.1 - 277.68", count: 32 },
  { bin: "277.68 - 283.26", count: 58 },
  { bin: "283.26 - 288.84", count: 42 },
  { bin: "288.84 - 294.42", count: 27 },
  { bin: "294.42 - 300.0", count: 93 }
]

// Data for averageRating histogram
const averageRatingData = [
  { bin: "1.0 - 1.18", count: 40 },
  { bin: "1.18 - 1.36", count: 82 },
  { bin: "1.36 - 1.54", count: 132 },
  { bin: "1.54 - 1.72", count: 185 },
  { bin: "1.72 - 1.9", count: 120 },
  { bin: "1.9 - 2.08", count: 311 },
  { bin: "2.08 - 2.26", count: 496 },
  { bin: "2.26 - 2.44", count: 675 },
  { bin: "2.44 - 2.62", count: 906 },
  { bin: "2.62 - 2.8", count: 573 },
  { bin: "2.8 - 2.98", count: 1262 },
  { bin: "2.98 - 3.16", count: 1638 },
  { bin: "3.16 - 3.34", count: 2157 },
  { bin: "3.34 - 3.52", count: 2595 },
  { bin: "3.52 - 3.7", count: 1565 },
  { bin: "3.7 - 3.88", count: 3446 },
  { bin: "3.88 - 4.06", count: 3658 },
  { bin: "4.06 - 4.24", count: 4735 },
  { bin: "4.24 - 4.42", count: 5933 },
  { bin: "4.42 - 4.6", count: 3201 },
  { bin: "4.6 - 4.78", count: 7547 },
  { bin: "4.78 - 4.96", count: 8411 },
  { bin: "4.96 - 5.14", count: 9736 },
  { bin: "5.14 - 5.32", count: 12027 },
  { bin: "5.32 - 5.5", count: 6809 },
  { bin: "5.5 - 5.68", count: 14636 },
  { bin: "5.68 - 5.86", count: 16477 },
  { bin: "5.86 - 6.04", count: 17071 },
  { bin: "6.04 - 6.22", count: 19835 },
  { bin: "6.22 - 6.4", count: 9989 },
  { bin: "6.4 - 6.58", count: 20542 },
  { bin: "6.58 - 6.76", count: 20040 },
  { bin: "6.76 - 6.94", count: 18906 },
  { bin: "6.94 - 7.12", count: 17982 },
  { bin: "7.12 - 7.3", count: 8699 },
  { bin: "7.3 - 7.48", count: 14523 },
  { bin: "7.48 - 7.66", count: 12077 },
  { bin: "7.66 - 7.84", count: 9255 },
  { bin: "7.84 - 8.02", count: 7164 },
  { bin: "8.02 - 8.2", count: 2990 },
  { bin: "8.2 - 8.38", count: 4814 },
  { bin: "8.38 - 8.56", count: 3442 },
  { bin: "8.56 - 8.74", count: 2487 },
  { bin: "8.74 - 8.92", count: 1698 },
  { bin: "8.92 - 9.1", count: 672 },
  { bin: "9.1 - 9.28", count: 818 },
  { bin: "9.28 - 9.46", count: 455 },
  { bin: "9.46 - 9.64", count: 236 },
  { bin: "9.64 - 9.82", count: 119 },
  { bin: "9.82 - 10.0", count: 38 }
]

// Data for weighted_rating histogram
const weightedRatingData = [
  { bin: "2.15 - 2.28", count: 5 },
  { bin: "2.28 - 2.42", count: 1 },
  { bin: "2.42 - 2.55", count: 3 },
  { bin: "2.55 - 2.68", count: 9 },
  { bin: "2.68 - 2.81", count: 19 },
  { bin: "2.81 - 2.94", count: 39 },
  { bin: "2.94 - 3.07", count: 58 },
  { bin: "3.07 - 3.2", count: 129 },
  { bin: "3.2 - 3.33", count: 379 },
  { bin: "3.33 - 3.46", count: 1584 },
  { bin: "3.46 - 3.59", count: 13387 },
  { bin: "3.59 - 3.72", count: 122866 },
  { bin: "3.72 - 3.86", count: 36670 },
  { bin: "3.86 - 3.99", count: 29616 },
  { bin: "3.99 - 4.12", count: 15584 },
  { bin: "4.12 - 4.25", count: 12492 },
  { bin: "4.25 - 4.38", count: 9232 },
  { bin: "4.38 - 4.51", count: 7220 },
  { bin: "4.51 - 4.64", count: 6064 },
  { bin: "4.64 - 4.77", count: 4961 },
  { bin: "4.77 - 4.9", count: 4537 },
  { bin: "4.9 - 5.03", count: 3922 },
  { bin: "5.03 - 5.16", count: 3514 },
  { bin: "5.16 - 5.3", count: 3178 },
  { bin: "5.3 - 5.43", count: 2977 },
  { bin: "5.43 - 5.56", count: 2812 },
  { bin: "5.56 - 5.69", count: 2516 },
  { bin: "5.69 - 5.82", count: 2302 },
  { bin: "5.82 - 5.95", count: 2219 },
  { bin: "5.95 - 6.08", count: 1981 },
  { bin: "6.08 - 6.21", count: 1783 },
  { bin: "6.21 - 6.34", count: 1671 },
  { bin: "6.34 - 6.47", count: 1527 },
  { bin: "6.47 - 6.61", count: 1337 },
  { bin: "6.61 - 6.74", count: 1268 },
  { bin: "6.74 - 6.87", count: 1017 },
  { bin: "6.87 - 7.0", count: 951 },
  { bin: "7.0 - 7.13", count: 721 },
  { bin: "7.13 - 7.26", count: 639 },
  { bin: "7.26 - 7.39", count: 552 },
  { bin: "7.39 - 7.52", count: 436 },
  { bin: "7.52 - 7.65", count: 307 },
  { bin: "7.65 - 7.78", count: 232 },
  { bin: "7.78 - 7.91", count: 179 },
  { bin: "7.91 - 8.05", count: 122 },
  { bin: "8.05 - 8.18", count: 81 },
  { bin: "8.18 - 8.31", count: 60 },
  { bin: "8.31 - 8.44", count: 28 },
  { bin: "8.44 - 8.57", count: 15 },
  { bin: "8.57 - 8.7", count: 3 }
]

// Data for movies released per month
const monthlyReleaseData = [
  { month: "Jan", count: 45694 },
  { month: "Feb", count: 20453 },
  { month: "Mar", count: 23807 },
  { month: "Apr", count: 22919 },
  { month: "May", count: 21011 },
  { month: "Jun", count: 21622 },
  { month: "Jul", count: 17842 },
  { month: "Aug", count: 20771 },
  { month: "Sep", count: 27383 },
  { month: "Oct", count: 30526 },
  { month: "Nov", count: 26120 },
  { month: "Dec", count: 25057 }
]

// Data for movies released per weekday
const weeklyReleaseData = [
  { day: "Mon", count: 73655 },
  { day: "Tue", count: 29645 },
  { day: "Wed", count: 37439 },
  { day: "Thu", count: 29231 },
  { day: "Fri", count: 53643 },
  { day: "Sat", count: 35540 },
  { day: "Sun", count: 44052 }
]

// Budget-Revenue data
const budgetRevenueData = [
  {
    "x": 160000000.0,
    "y": 825532764.0
  },
  {
    "x": 165000000.0,
    "y": 701729206.0
  },
  {
    "x": 185000000.0,
    "y": 1004558444.0
  },
  {
    "x": 237000000.0,
    "y": 2923706026.0
  },
  {
    "x": 220000000.0,
    "y": 1518815515.0
  },
  {
    "x": 58000000.0,
    "y": 783100000.0
  },
  {
    "x": 300000000.0,
    "y": 2052415039.0
  },
  {
    "x": 63000000.0,
    "y": 100853753.0
  },
  {
    "x": 170000000.0,
    "y": 772776600.0
  },
  {
    "x": 8500000.0,
    "y": 213900000.0
  },
  {
    "x": 55000000.0,
    "y": 677387716.0
  },
  {
    "x": 125000000.0,
    "y": 976475550.0
  },
  {
    "x": 140000000.0,
    "y": 585174222.0
  },
  {
    "x": 100000000.0,
    "y": 425368238.0
  },
  {
    "x": 25000000.0,
    "y": 28341469.0
  },
  {
    "x": 356000000.0,
    "y": 2800000000.0
  },
  {
    "x": 63000000.0,
    "y": 463517383.0
  },
  {
    "x": 200000000.0,
    "y": 2264162353.0
  },
  {
    "x": 55000000.0,
    "y": 1074458282.0
  },
  {
    "x": 93000000.0,
    "y": 871368364.0
  },
  {
    "x": 94000000.0,
    "y": 1118888979.0
  },
  {
    "x": 80000000.0,
    "y": 294800000.0
  },
  {
    "x": 100000000.0,
    "y": 392000000.0
  },
  {
    "x": 365000000.0,
    "y": 1405403694.0
  },
  {
    "x": 250000000.0,
    "y": 1155046416.0
  },
  {
    "x": 250000000.0,
    "y": 1081041287.0
  },
  {
    "x": 200000000.0,
    "y": 1215577205.0
  },
  {
    "x": 200000000.0,
    "y": 1349926083.0
  },
  {
    "x": 180000000.0,
    "y": 676343174.0
  },
  {
    "x": 150000000.0,
    "y": 378858340.0
  },
  {
    "x": 70000000.0,
    "y": 321457747.0
  },
  {
    "x": 75000000.0,
    "y": 694394724.0
  },
  {
    "x": 175000000.0,
    "y": 880166924.0
  },
  {
    "x": 100000000.0,
    "y": 876688482.0
  },
  {
    "x": 200000000.0,
    "y": 863756051.0
  },
  {
    "x": 79000000.0,
    "y": 926287400.0
  },
  {
    "x": 140000000.0,
    "y": 370569774.0
  },
  {
    "x": 175000000.0,
    "y": 746846894.0
  },
  {
    "x": 130000000.0,
    "y": 789804554.0
  },
  {
    "x": 150000000.0,
    "y": 449326618.0
  },
  {
    "x": 200000000.0,
    "y": 623933331.0
  },
  {
    "x": 150000000.0,
    "y": 374218673.0
  },
  {
    "x": 180000000.0,
    "y": 855301806.0
  },
  {
    "x": 175000000.0,
    "y": 857611174.0
  },
  {
    "x": 150000000.0,
    "y": 1671537444.0
  },
  {
    "x": 33000000.0,
    "y": 327311859.0
  },
  {
    "x": 150000000.0,
    "y": 895921036.0
  },
  {
    "x": 140000000.0,
    "y": 655011224.0
  },
  {
    "x": 125000000.0,
    "y": 1341511219.0
  },
  {
    "x": 11000000.0,
    "y": 775398007.0
  },
  {
    "x": 149000000.0,
    "y": 822854286.0
  },
  {
    "x": 175000000.0,
    "y": 735099082.0
  },
  {
    "x": 130000000.0,
    "y": 519311965.0
  },
  {
    "x": 6000000.0,
    "y": 245066411.0
  },
  {
    "x": 108000000.0,
    "y": 630600000.0
  },
  {
    "x": 19000000.0,
    "y": 381109762.0
  },
  {
    "x": 245000000.0,
    "y": 2068223624.0
  },
  {
    "x": 200000000.0,
    "y": 1921847111.0
  },
  {
    "x": 150000000.0,
    "y": 938212738.0
  },
  {
    "x": 250000000.0,
    "y": 933959197.0
  },
  {
    "x": 97000000.0,
    "y": 619021436.0
  },
  {
    "x": 94000000.0,
    "y": 940335536.0
  },
  {
    "x": 40000000.0,
    "y": 701800000.0
  },
  {
    "x": 20000000.0,
    "y": 88761661.0
  },
  {
    "x": 180000000.0,
    "y": 809342332.0
  },
  {
    "x": 250000000.0,
    "y": 954305868.0
  },
  {
    "x": 175000000.0,
    "y": 800526015.0
  },
  {
    "x": 170000000.0,
    "y": 714766572.0
  },
  {
    "x": 139000000.0,
    "y": 821708551.0
  },
  {
    "x": 180000000.0,
    "y": 521311860.0
  },
  {
    "x": 61000000.0,
    "y": 369330363.0
  },
  {
    "x": 250000000.0,
    "y": 1021103568.0
  },
  {
    "x": 115000000.0,
    "y": 579707738.0
  },
  {
    "x": 30000000.0,
    "y": 394400000.0
  },
  {
    "x": 135000000.0,
    "y": 532950503.0
  },
  {
    "x": 250000000.0,
    "y": 873637528.0
  },
  {
    "x": 45000000.0,
    "y": 763455561.0
  },
  {
    "x": 103000000.0,
    "y": 465361176.0
  },
  {
    "x": 60000000.0,
    "y": 264118201.0
  },
  {
    "x": 92000000.0,
    "y": 631442092.0
  },
  {
    "x": 47000000.0,
    "y": 203388186.0
  },
  {
    "x": 11363000.0,
    "y": 257591776.0
  },
  {
    "x": 170000000.0,
    "y": 644783140.0
  },
  {
    "x": 215000000.0,
    "y": 757930663.0
  },
  {
    "x": 9000000.0,
    "y": 278454358.0
  },
  {
    "x": 110000000.0,
    "y": 785896609.0
  },
  {
    "x": 19000000.0,
    "y": 44781695.0
  },
  {
    "x": 30000000.0,
    "y": 180906076.0
  },
  {
    "x": 130000000.0,
    "y": 865011746.0
  },
  {
    "x": 13000000.0,
    "y": 426588510.0
  },
  {
    "x": 4500000.0,
    "y": 255407969.0
  },
  {
    "x": 14000000.0,
    "y": 233555708.0
  },
  {
    "x": 52000000.0,
    "y": 903992901.0
  },
  {
    "x": 60000000.0,
    "y": 286801374.0
  },
  {
    "x": 34000000.0,
    "y": 348319861.0
  },
  {
    "x": 35000000.0,
    "y": 469310836.0
  },
  {
    "x": 18000000.0,
    "y": 538400000.0
  },
  {
    "x": 60000000.0,
    "y": 487853320.0
  },
  {
    "x": 150000000.0,
    "y": 623726000.0
  },
  {
    "x": 81000000.0,
    "y": 414351546.0
  }
]

// Data for runtime vs popularity
const runtimePopularityData = [
  {
    "x": 148.0,
    "y": 83.952
  },
  {
    "x": 169.0,
    "y": 140.241
  },
  {
    "x": 152.0,
    "y": 130.643
  },
  {
    "x": 162.0,
    "y": 79.932
  },
  {
    "x": 143.0,
    "y": 98.082
  },
  {
    "x": 108.0,
    "y": 72.735
  },
  {
    "x": 149.0,
    "y": 154.34
  },
  {
    "x": 139.0,
    "y": 69.498
  },
  {
    "x": 121.0,
    "y": 33.255
  },
  {
    "x": 154.0,
    "y": 74.862
  },
  {
    "x": 142.0,
    "y": 92.693
  },
  {
    "x": 152.0,
    "y": 185.482
  },
  {
    "x": 126.0,
    "y": 72.897
  },
  {
    "x": 165.0,
    "y": 54.224
  },
  {
    "x": 142.0,
    "y": 122.61
  },
  {
    "x": 181.0,
    "y": 91.756
  },
  {
    "x": 136.0,
    "y": 78.564
  },
  {
    "x": 194.0,
    "y": 102.348
  },
  {
    "x": 122.0,
    "y": 54.522
  },
  {
    "x": 179.0,
    "y": 87.037
  },
  {
    "x": 201.0,
    "y": 99.276
  },
  {
    "x": 138.0,
    "y": 56.595
  },
  {
    "x": 180.0,
    "y": 97.444
  },
  {
    "x": 141.0,
    "y": 96.565
  },
  {
    "x": 147.0,
    "y": 70.741
  },
  {
    "x": 165.0,
    "y": 76.914
  },
  {
    "x": 130.0,
    "y": 61.06
  },
  {
    "x": 135.0,
    "y": 43.665
  },
  {
    "x": 115.0,
    "y": 70.535
  },
  {
    "x": 121.0,
    "y": 78.319
  },
  {
    "x": 153.0,
    "y": 59.162
  },
  {
    "x": 142.0,
    "y": 29.577
  },
  {
    "x": 133.0,
    "y": 65.88
  },
  {
    "x": 161.0,
    "y": 121.699
  },
  {
    "x": 137.0,
    "y": 67.553
  },
  {
    "x": 179.0,
    "y": 78.73
  },
  {
    "x": 124.0,
    "y": 43.665
  },
  {
    "x": 123.0,
    "y": 35.356
  },
  {
    "x": 141.0,
    "y": 124.386
  },
  {
    "x": 115.0,
    "y": 51.277
  },
  {
    "x": 124.0,
    "y": 84.445
  },
  {
    "x": 140.0,
    "y": 66.286
  },
  {
    "x": 131.0,
    "y": 45.2
  },
  {
    "x": 95.0,
    "y": 107.292
  },
  {
    "x": 124.0,
    "y": 54.089
  },
  {
    "x": 127.0,
    "y": 53.521
  },
  {
    "x": 157.0,
    "y": 134.276
  },
  {
    "x": 143.0,
    "y": 80.509
  },
  {
    "x": 130.0,
    "y": 110.974
  },
  {
    "x": 121.0,
    "y": 88.559
  },
  {
    "x": 141.0,
    "y": 54.628
  },
  {
    "x": 96.0,
    "y": 90.968
  },
  {
    "x": 117.0,
    "y": 37.692
  },
  {
    "x": 175.0,
    "y": 158.448
  },
  {
    "x": 141.0,
    "y": 76.0
  },
  {
    "x": 116.0,
    "y": 62.543
  },
  {
    "x": 136.0,
    "y": 66.772
  },
  {
    "x": 148.0,
    "y": 186.065
  },
  {
    "x": 138.0,
    "y": 117.168
  },
  {
    "x": 153.0,
    "y": 121.735
  },
  {
    "x": 137.0,
    "y": 54.194
  },
  {
    "x": 100.0,
    "y": 55.456
  },
  {
    "x": 135.0,
    "y": 74.73
  },
  {
    "x": 101.0,
    "y": 55.739
  },
  {
    "x": 132.0,
    "y": 46.103
  },
  {
    "x": 146.0,
    "y": 111.984
  },
  {
    "x": 105.0,
    "y": 166.578
  },
  {
    "x": 136.0,
    "y": 31.482
  },
  {
    "x": 121.0,
    "y": 63.478
  },
  {
    "x": 98.0,
    "y": 58.517
  },
  {
    "x": 149.0,
    "y": 46.611
  },
  {
    "x": 169.0,
    "y": 83.524
  },
  {
    "x": 92.0,
    "y": 86.936
  },
  {
    "x": 81.0,
    "y": 78.404
  },
  {
    "x": 157.0,
    "y": 36.747
  },
  {
    "x": 152.0,
    "y": 78.589
  },
  {
    "x": 89.0,
    "y": 87.384
  },
  {
    "x": 155.0,
    "y": 53.587
  },
  {
    "x": 103.0,
    "y": 42.954
  },
  {
    "x": 115.0,
    "y": 62.609
  },
  {
    "x": 116.0,
    "y": 47.983
  },
  {
    "x": 133.0,
    "y": 64.627
  },
  {
    "x": 112.0,
    "y": 59.968
  },
  {
    "x": 136.0,
    "y": 78.989
  },
  {
    "x": 117.0,
    "y": 44.51
  },
  {
    "x": 120.0,
    "y": 66.096
  },
  {
    "x": 144.0,
    "y": 45.252
  },
  {
    "x": 111.0,
    "y": 36.315
  },
  {
    "x": 146.0,
    "y": 49.864
  },
  {
    "x": 113.0,
    "y": 41.656
  },
  {
    "x": 104.0,
    "y": 36.442
  },
  {
    "x": 113.0,
    "y": 47.491
  },
  {
    "x": 135.0,
    "y": 37.55
  },
  {
    "x": 189.0,
    "y": 83.739
  },
  {
    "x": 113.0,
    "y": 83.206
  },
  {
    "x": 100.0,
    "y": 72.655
  },
  {
    "x": 124.0,
    "y": 35.265
  },
  {
    "x": 90.0,
    "y": 94.456
  },
  {
    "x": 111.0,
    "y": 82.488
  },
  {
    "x": 129.0,
    "y": 56.288
  }
  // ... rest of the data
]

// Data for release year vs popularity
const yearPopularityData = [
  { x: 2010.0, y: 83.952 },
  { x: 2014.0, y: 140.241 },
  // ... rest of the data
]

// Data for average rating vs number of votes
const ratingVotesData = [
  { x: 8.8, y: 2645153.0 },
  { x: 8.7, y: 2268051.0 },
  // ... rest of the data
]

// Data for popularity vs revenue
const popularityRevenueData = [
  {
    "x": 83.952,
    "y": 825532764.0
  },
  {
    "x": 140.241,
    "y": 701729206.0
  },
  {
    "x": 130.643,
    "y": 1004558444.0
  },
  {
    "x": 79.932,
    "y": 2923706026.0
  },
  {
    "x": 98.082,
    "y": 1518815515.0
  },
  {
    "x": 72.735,
    "y": 783100000.0
  },
  {
    "x": 154.34,
    "y": 2052415039.0
  },
  {
    "x": 69.498,
    "y": 100853753.0
  },
  {
    "x": 33.255,
    "y": 772776600.0
  },
  {
    "x": 74.862,
    "y": 213900000.0
  },
  {
    "x": 92.693,
    "y": 677387716.0
  },
  {
    "x": 185.482,
    "y": 976475550.0
  },
  {
    "x": 72.897,
    "y": 585174222.0
  },
  {
    "x": 54.224,
    "y": 425368238.0
  },
  {
    "x": 122.61,
    "y": 28341469.0
  },
  {
    "x": 91.756,
    "y": 2800000000.0
  },
  {
    "x": 78.564,
    "y": 463517383.0
  },
  {
    "x": 102.348,
    "y": 2264162353.0
  },
  {
    "x": 54.522,
    "y": 1074458282.0
  },
  {
    "x": 87.037,
    "y": 871368364.0
  },
  {
    "x": 99.276,
    "y": 1118888979.0
  },
  {
    "x": 56.595,
    "y": 294800000.0
  },
  {
    "x": 97.444,
    "y": 392000000.0
  },
  {
    "x": 96.565,
    "y": 1405403694.0
  },
  {
    "x": 70.741,
    "y": 1155046416.0
  },
  {
    "x": 76.914,
    "y": 1081041287.0
  },
  {
    "x": 61.06,
    "y": 1215577205.0
  },
  {
    "x": 43.665,
    "y": 1349926083.0
  },
  {
    "x": 70.535,
    "y": 676343174.0
  },
  {
    "x": 78.319,
    "y": 378858340.0
  },
  {
    "x": 59.162,
    "y": 321457747.0
  },
  {
    "x": 29.577,
    "y": 694394724.0
  },
  {
    "x": 65.88,
    "y": 880166924.0
  },
  {
    "x": 121.699,
    "y": 876688482.0
  },
  {
    "x": 67.553,
    "y": 863756051.0
  },
  {
    "x": 78.73,
    "y": 926287400.0
  },
  {
    "x": 43.665,
    "y": 370569774.0
  },
  {
    "x": 35.356,
    "y": 746846894.0
  },
  {
    "x": 124.386,
    "y": 789804554.0
  },
  {
    "x": 51.277,
    "y": 449326618.0
  },
  {
    "x": 84.445,
    "y": 623933331.0
  },
  {
    "x": 66.286,
    "y": 374218673.0
  },
  {
    "x": 45.2,
    "y": 855301806.0
  },
  {
    "x": 107.292,
    "y": 857611174.0
  },
  {
    "x": 54.089,
    "y": 1671537444.0
  },
  {
    "x": 53.521,
    "y": 327311859.0
  },
  {
    "x": 134.276,
    "y": 895921036.0
  },
  {
    "x": 80.509,
    "y": 655011224.0
  },
  {
    "x": 110.974,
    "y": 1341511219.0
  },
  {
    "x": 88.559,
    "y": 775398007.0
  },
  {
    "x": 54.628,
    "y": 822854286.0
  },
  {
    "x": 90.968,
    "y": 735099082.0
  },
  {
    "x": 37.692,
    "y": 519311965.0
  },
  {
    "x": 158.448,
    "y": 245066411.0
  },
  {
    "x": 76.0,
    "y": 630600000.0
  },
  {
    "x": 62.543,
    "y": 381109762.0
  },
  {
    "x": 66.772,
    "y": 2068223624.0
  },
  {
    "x": 186.065,
    "y": 1921847111.0
  },
  {
    "x": 117.168,
    "y": 938212738.0
  },
  {
    "x": 121.735,
    "y": 933959197.0
  },
  {
    "x": 54.194,
    "y": 619021436.0
  },
  {
    "x": 55.456,
    "y": 940335536.0
  },
  {
    "x": 74.73,
    "y": 701800000.0
  },
  {
    "x": 55.739,
    "y": 88761661.0
  },
  {
    "x": 46.103,
    "y": 809342332.0
  },
  {
    "x": 111.984,
    "y": 954305868.0
  },
  {
    "x": 166.578,
    "y": 800526015.0
  },
  {
    "x": 31.482,
    "y": 714766572.0
  },
  {
    "x": 63.478,
    "y": 821708551.0
  },
  {
    "x": 58.517,
    "y": 521311860.0
  },
  {
    "x": 46.611,
    "y": 369330363.0
  },
  {
    "x": 83.524,
    "y": 1021103568.0
  },
  {
    "x": 86.936,
    "y": 579707738.0
  },
  {
    "x": 78.404,
    "y": 394400000.0
  },
  {
    "x": 36.747,
    "y": 532950503.0
  },
  {
    "x": 78.589,
    "y": 873637528.0
  },
  {
    "x": 87.384,
    "y": 763455561.0
  },
  {
    "x": 53.587,
    "y": 465361176.0
  },
  {
    "x": 42.954,
    "y": 264118201.0
  },
  {
    "x": 62.609,
    "y": 631442092.0
  },
  {
    "x": 47.983,
    "y": 203388186.0
  },
  {
    "x": 64.627,
    "y": 257591776.0
  },
  {
    "x": 59.968,
    "y": 644783140.0
  },
  {
    "x": 78.989,
    "y": 757930663.0
  },
  {
    "x": 44.51,
    "y": 278454358.0
  },
  {
    "x": 66.096,
    "y": 785896609.0
  },
  {
    "x": 45.252,
    "y": 44781695.0
  },
  {
    "x": 36.315,
    "y": 180906076.0
  },
  {
    "x": 49.864,
    "y": 865011746.0
  },
  {
    "x": 41.656,
    "y": 426588510.0
  },
  {
    "x": 36.442,
    "y": 255407969.0
  },
  {
    "x": 47.491,
    "y": 233555708.0
  },
  {
    "x": 37.55,
    "y": 903992901.0
  },
  {
    "x": 83.739,
    "y": 286801374.0
  },
  {
    "x": 83.206,
    "y": 348319861.0
  },
  {
    "x": 72.655,
    "y": 469310836.0
  },
  {
    "x": 35.265,
    "y": 538400000.0
  },
  {
    "x": 94.456,
    "y": 487853320.0
  },
  {
    "x": 82.488,
    "y": 623726000.0
  },
  {
    "x": 56.288,
    "y": 414351546.0
  }
  // ... rest of the data
]

// Data for age vs weighted rating
const ageRatingData = [
  { x: 15.0, y: 8.36056521669135 },
  { x: 11.0, y: 8.41332182722375 },
  // ... rest of the data
]

// Genre Revenue data
const genreRevenueData = [
  {
    "name": "adventure",
    "value": 14508772.590902422
  },
  {
    "name": "action",
    "value": 8423105.409640398
  },
  {
    "name": "fantasy",
    "value": 6921514.7068796065
  },
  {
    "name": "science fiction",
    "value": 6093037.275690718
  },
  {
    "name": "family",
    "value": 4498698.583683062
  },
  {
    "name": "animation",
    "value": 2690639.14130488
  },
  {
    "name": "war",
    "value": 2679260.9464634624
  },
  {
    "name": "mystery",
    "value": 2074457.8504483656
  },
  {
    "name": "thriller",
    "value": 1876292.2059797768
  },
  {
    "name": "crime",
    "value": 1729906.8413061374
  },
  {
    "name": "comedy",
    "value": 1671449.6896242022
  },
  {
    "name": "horror",
    "value": 1449188.201502767
  },
  {
    "name": "romance",
    "value": 1224771.2080904117
  },
  {
    "name": "history",
    "value": 986460.8066298342
  },
  {
    "name": "drama",
    "value": 962611.0808113229
  },
  {
    "name": "western",
    "value": 942209.7767878077
  },
  {
    "name": "music",
    "value": 616316.8151085684
  },
  {
    "name": "documentary",
    "value": 47251.97485209777
  },
  {
    "name": "tv movie",
    "value": 12065.851374570446
  },
  {
    "name": "unknown",
    "value": 6680.461309600807
  }
]

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
        <p className="font-medium text-pink-600">{label}</p>
        <p className="text-gray-700">{`Count: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for scatter plot
const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
        <p className="font-medium text-pink-600">Movie</p>
        <p className="text-gray-700">Budget: ${(payload[0].payload.x / 1e6).toFixed(1)}M</p>
        <p className="text-gray-700">Revenue: ${(payload[0].payload.y / 1e6).toFixed(1)}M</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for genre revenue
const GenreRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
        <p className="font-medium text-pink-600">{label}</p>
        <p className="text-gray-700">{`Revenue: $${payload[0].value.toLocaleString(undefined, {maximumFractionDigits: 2})}`}</p>
      </div>
    );
  }
  return null;
};

// Component for Budget vs Revenue Scatter Chart
const BudgetRevenueChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Budget vs. Revenue</CardTitle>
        <CardDescription>Relationship between movie budget and box office revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="Budget"
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Revenue"
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter 
                name="Movies" 
                data={budgetRevenueData} 
                fill="url(#scatterGradient)"
              />
              <defs>
                <linearGradient id="scatterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Higher budgets generally correlate with higher revenue
        </div>
        <div className="leading-none text-gray-500">
          Showing the relationship between movie budget and box office revenue
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Genre Revenue Bar Chart
const GenreRevenueChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Genre vs. Revenue</CardTitle>
        <CardDescription>Average revenue by movie genre</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={genreRevenueData}
              margin={{ top: 20, right: 100, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis 
                type="number" 
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
                width={120}
                interval={0}
              />
              <Tooltip content={<GenreRevenueTooltip />} />
              <Bar 
                dataKey="value" 
                fill="url(#genreRevenueGradient)" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                <LabelList 
                  dataKey="value" 
                  position="right" 
                  formatter={(value: number) => `$${(value / 1e6).toFixed(1)}M`}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                  offset={10}
                />
              </Bar>
              <defs>
                <linearGradient id="genreRevenueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Adventure and action genres generate the highest revenue
        </div>
        <div className="leading-none text-gray-500">
          Showing average revenue by movie genre
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Runtime Histogram
const RuntimeHistogram = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Movie Runtime Distribution</CardTitle>
        <CardDescription>Distribution of movie durations in minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={runtimeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="bin" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
                height={100}
                interval={0}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#runtimeGradient)" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="runtimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Most movies have a runtime between 87-94 minutes
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of movie durations in the database
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Average Rating Histogram
const AverageRatingHistogram = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Average Rating Distribution</CardTitle>
        <CardDescription>Distribution of movie ratings on a scale of 1-10</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={averageRatingData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="bin" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
                height={100}
                interval={0}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#ratingGradient)" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Most movies have ratings between 6.4-6.58
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of movie ratings in the database
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Weighted Rating Histogram
const WeightedRatingHistogram = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Weighted Rating Distribution</CardTitle>
        <CardDescription>Distribution of weighted movie ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weightedRatingData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="bin" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
                height={100}
                interval={0}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#weightedRatingGradient)" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="weightedRatingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Most movies have weighted ratings between 3.59-3.72
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of weighted movie ratings in the database
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Monthly Releases
const MonthlyReleasesChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Movies Released Per Month</CardTitle>
        <CardDescription>Distribution of movie releases by month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyReleaseData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#monthlyGradient)" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> January has the highest number of movie releases
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of movie releases by month
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Weekly Releases
const WeeklyReleasesChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Movies Released Per Weekday</CardTitle>
        <CardDescription>Distribution of movie releases by day of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyReleaseData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9c27b0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="url(#weeklyGradient)" 
                radius={[4, 4, 0, 0]}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Monday has the highest number of movie releases
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of movie releases by day of the week
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Runtime vs Popularity Scatter Chart
const RuntimePopularityChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Runtime vs. Popularity</CardTitle>
        <CardDescription>Relationship between movie runtime and popularity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="Runtime"
                unit=" min"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Popularity"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter 
                name="Movies" 
                data={runtimePopularityData} 
                fill="url(#runtimePopularityGradient)"
              />
              <defs>
                <linearGradient id="runtimePopularityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> No strong correlation between runtime and popularity
        </div>
        <div className="leading-none text-gray-500">
          Showing how movie runtime relates to popularity
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Popularity vs Revenue Scatter Chart
const PopularityRevenueChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Popularity vs. Revenue</CardTitle>
        <CardDescription>Relationship between movie popularity and box office revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="Popularity"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Revenue"
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter 
                name="Movies" 
                data={popularityRevenueData} 
                fill="url(#popularityRevenueGradient)"
              />
              <defs>
                <linearGradient id="popularityRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> More popular movies tend to generate higher revenue
        </div>
        <div className="leading-none text-gray-500">
          Showing how movie popularity relates to box office revenue
        </div>
      </CardFooter>
    </Card>
  );
};

// Data for average revenue by year
const yearlyRevenueData = [
  { year: 1980, averageRevenue: 1154239.0820578232 },
  { year: 1981, averageRevenue: 1070165.7148257035 },
  { year: 1982, averageRevenue: 1327222.3989296006 },
  { year: 1983, averageRevenue: 1236501.151431934 },
  { year: 1984, averageRevenue: 1233646.2557449962 },
  { year: 1985, averageRevenue: 1301466.2168376371 },
  { year: 1986, averageRevenue: 1307315.8630993746 },
  { year: 1987, averageRevenue: 1467175.4747162024 },
  { year: 1988, averageRevenue: 1623362.0207201086 },
  { year: 1989, averageRevenue: 2022116.0554072096 },
  { year: 1990, averageRevenue: 2309951.6417391305 },
  { year: 1991, averageRevenue: 2037918.3491083677 },
  { year: 1992, averageRevenue: 2409904.7514569764 },
  { year: 1993, averageRevenue: 2619697.058569052 },
  { year: 1994, averageRevenue: 2699488.6365366317 },
  { year: 1995, averageRevenue: 2964041.3267477206 },
  { year: 1996, averageRevenue: 2977322.243665937 },
  { year: 1997, averageRevenue: 3972476.5898809526 },
  { year: 1998, averageRevenue: 3389994.055507372 },
  { year: 1999, averageRevenue: 3739023.964098315 },
  { year: 2000, averageRevenue: 3386885.701025506 },
  { year: 2001, averageRevenue: 3814630.084045932 },
  { year: 2002, averageRevenue: 3930212.3153632577 },
  { year: 2003, averageRevenue: 3900924.6323874546 },
  { year: 2004, averageRevenue: 3803658.6743768696 },
  { year: 2005, averageRevenue: 3404777.2309974045 },
  { year: 2006, averageRevenue: 3280124.4474954237 },
  { year: 2007, averageRevenue: 3627724.3501377855 },
  { year: 2008, averageRevenue: 3532413.048518348 },
  { year: 2009, averageRevenue: 3760144.2548933686 },
  { year: 2010, averageRevenue: 3756268.719503179 },
  { year: 2011, averageRevenue: 3603143.7956873314 },
  { year: 2012, averageRevenue: 3634961.0306083406 },
  { year: 2013, averageRevenue: 3506145.1880755606 },
  { year: 2014, averageRevenue: 3349746.4304561717 },
  { year: 2015, averageRevenue: 3377495.639176393 },
  { year: 2016, averageRevenue: 3514936.7054654784 },
  { year: 2017, averageRevenue: 3423582.9894683543 },
  { year: 2018, averageRevenue: 3194168.4081181553 },
  { year: 2019, averageRevenue: 3085433.8834667187 },
  { year: 2020, averageRevenue: 749901.9967169261 },
  { year: 2021, averageRevenue: 1962809.047800485 },
  { year: 2022, averageRevenue: 2364744.412233752 },
  { year: 2023, averageRevenue: 2583410.503714494 },
  { year: 2024, averageRevenue: 7231.150375939849 }
]

// Data for average revenue by weekday
const weekdayRevenueData = [
  { day: "Mon", averageRevenue: 2844505.880008146 },
  { day: "Tue", averageRevenue: 737521.748186878 },
  { day: "Wed", averageRevenue: 729445.5674563957 },
  { day: "Thu", averageRevenue: 540950.5467825254 },
  { day: "Fri", averageRevenue: 2658208.372425107 },
  { day: "Sat", averageRevenue: 1795708.6862408554 },
  { day: "Sun", averageRevenue: 5228763.676949969 }
]

// Data for movies by age group
const ageGroupData = [
  { ageGroup: "0-5", count: 25746 },
  { ageGroup: "5-10", count: 47611 },
  { ageGroup: "10-20", count: 74057 },
  { ageGroup: "20-50", count: 95081 },
  { ageGroup: "50-100", count: 57431 },
  { ageGroup: "100+", count: 3279 }
]

// Component for Yearly Revenue Line Chart
const YearlyRevenueChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Average Revenue by Year</CardTitle>
        <CardDescription>Trend of average movie revenue from 1980 to 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={yearlyRevenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const value = typeof data?.value === 'number' ? data.value : 0;
                    const year = data?.payload?.year ?? 'N/A';
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
                        <p className="font-medium text-pink-600">{year}</p>
                        <p className="text-gray-700">Average Revenue: ${(value / 1e6).toFixed(1)}M</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="averageRevenue"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: "#d946ef", r: 4 }}
                activeDot={{ r: 8, fill: "#ec4899" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Average revenue peaked in the late 1990s
        </div>
        <div className="leading-none text-gray-500">
          Showing the trend of average movie revenue over time
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Weekday Revenue Bar Chart
const WeekdayRevenueChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Average Revenue by Weekday</CardTitle>
        <CardDescription>Distribution of average revenue across days of the week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayRevenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const value = typeof data?.value === 'number' ? data.value : 0;
                    const day = data?.payload?.day ?? 'N/A';
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
                        <p className="font-medium text-pink-600">{day}</p>
                        <p className="text-gray-700">Average Revenue: ${(value / 1e6).toFixed(1)}M</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="averageRevenue"
                fill="url(#weekdayRevenueGradient)"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="averageRevenue"
                  position="top"
                  formatter={(value: number) => `$${(value / 1e6).toFixed(1)}M`}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="weekdayRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Sunday releases generate the highest average revenue
        </div>
        <div className="leading-none text-gray-500">
          Showing average revenue distribution across weekdays
        </div>
      </CardFooter>
    </Card>
  );
};

// Component for Age Group Distribution Bar Chart
const AgeGroupChart = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
      <CardHeader>
        <CardTitle className="text-pink-600">Movies by Age Group</CardTitle>
        <CardDescription>Distribution of movies across different age ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageGroupData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="ageGroup"
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#9c27b0' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const value = typeof data?.value === 'number' ? data.value : 0;
                    const ageGroup = data?.payload?.ageGroup ?? 'N/A';
                    return (
                      <div className="bg-white/90 backdrop-blur-sm p-3 border border-pink-200 rounded-lg shadow-md">
                        <p className="font-medium text-pink-600">{ageGroup}</p>
                        <p className="text-gray-700">Average Revenue: ${(value / 1e6).toFixed(1)}M</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="count"
                fill="url(#ageGroupGradient)"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="count"
                  position="top"
                  formatter={(value: number) => value.toLocaleString()}
                  style={{ fill: '#9c27b0', fontSize: '12px' }}
                />
              </Bar>
              <defs>
                <linearGradient id="ageGroupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-pink-600">
          <TrendingUp className="h-4 w-4" /> Most movies are between 20-50 years old
        </div>
        <div className="leading-none text-gray-500">
          Showing distribution of movies across different age ranges
        </div>
      </CardFooter>
    </Card>
  );
};

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-100 py-8 px-4" suppressHydrationWarning>
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4 text-pink-600 hover:text-pink-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            Analytics
          </h1>
        </div>
        
        <Tabs defaultValue="univariate" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm border-2 border-pink-200">
            <TabsTrigger value="univariate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Univariate</TabsTrigger>
            <TabsTrigger value="bivariate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Bivariate</TabsTrigger>
            <TabsTrigger value="multivariate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">Multivariate</TabsTrigger>
          </TabsList>
          
          {/* Univariate Analysis Tab */}
          <TabsContent value="univariate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Status Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-pink-600">Movie Status Distribution</CardTitle>
                  <CardDescription>Distribution of movies by their current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statusData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="url(#pinkGradient)" 
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList 
                            dataKey="value" 
                            position="top" 
                            formatter={(value: number) => value.toLocaleString()}
                            style={{ fill: '#9c27b0', fontSize: '12px' }}
                          />
                        </Bar>
                        <defs>
                          <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none text-pink-600">
                    <TrendingUp className="h-4 w-4" /> Most movies are in Released status
                  </div>
                  <div className="leading-none text-gray-500">
                    Showing distribution of movie statuses in the database
                  </div>
                </CardFooter>
              </Card>

              {/* Language Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-pink-600">Original Language Distribution</CardTitle>
                  <CardDescription>Top languages by movie count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={languageData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#ec4899" 
                          strokeWidth={2}
                          dot={{ fill: "#d946ef", r: 4 }}
                          activeDot={{ r: 8, fill: "#ec4899" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none text-pink-600">
                    <TrendingUp className="h-4 w-4" /> English dominates as the primary language
                  </div>
                  <div className="leading-none text-gray-500">
                    Showing top original languages of movies in the database
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Genre Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-pink-600">Genre Distribution</CardTitle>
                  <CardDescription>Top movie genres by count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={genreData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="value" 
                          fill="url(#purpleGradient)" 
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList 
                            dataKey="value" 
                            position="top" 
                            formatter={(value: number) => value.toLocaleString()}
                            style={{ fill: '#9c27b0', fontSize: '12px' }}
                          />
                        </Bar>
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none text-pink-600">
                    <TrendingUp className="h-4 w-4" /> Drama is the most common genre
                  </div>
                  <div className="leading-none text-gray-500">
                    Showing distribution of movie genres in the database
                  </div>
                </CardFooter>
              </Card>

              {/* Production Countries Chart */}
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-pink-600">Production Countries</CardTitle>
                  <CardDescription>Top countries by movie production</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={countryData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: '#9c27b0' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#d946ef" 
                          strokeWidth={2}
                          dot={{ fill: "#a855f7", r: 4 }}
                          activeDot={{ r: 8, fill: "#d946ef" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none text-pink-600">
                    <TrendingUp className="h-4 w-4" /> United States leads in movie production
                  </div>
                  <div className="leading-none text-gray-500">
                    Showing top countries by movie production count
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Spoken Languages Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-pink-600">Spoken Languages</CardTitle>
                <CardDescription>Distribution of spoken languages in movies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spokenLanguageData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#9c27b0' }}
                      />
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#9c27b0' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        fill="url(#pinkPurpleGradient)" 
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList 
                          dataKey="value" 
                          position="top" 
                          formatter={(value: number) => value.toLocaleString()}
                          style={{ fill: '#9c27b0', fontSize: '12px' }}
                        />
                      </Bar>
                      <defs>
                        <linearGradient id="pinkPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-pink-600">
                  <TrendingUp className="h-4 w-4" /> English is the most common spoken language
                </div>
                <div className="leading-none text-gray-500">
                  Showing distribution of spoken languages in movies
                </div>
              </CardFooter>
            </Card>
            
            {/* Runtime Histogram */}
            <RuntimeHistogram />
            
            {/* Average Rating Histogram */}
            <AverageRatingHistogram />
            
            {/* Weighted Rating Histogram */}
            <WeightedRatingHistogram />
            
            {/* Monthly Releases Chart */}
            <MonthlyReleasesChart />
            
            {/* Weekly Releases Chart */}
            <WeeklyReleasesChart />
          </TabsContent>
          
          {/* Bivariate Analysis Tab */}
          <TabsContent value="bivariate">
            <BudgetRevenueChart />
            <GenreRevenueChart />
            <RuntimePopularityChart />
            <PopularityRevenueChart />
            <YearlyRevenueChart />
            <WeekdayRevenueChart />
            <AgeGroupChart />
          </TabsContent>
          
          {/* Multivariate Analysis Tab */}
          <TabsContent value="multivariate">
            <Card className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-pink-600">Multivariate Analysis</CardTitle>
                <CardDescription>Relationships between multiple variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <p className="text-gray-500 text-center">Multivariate analysis charts coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 