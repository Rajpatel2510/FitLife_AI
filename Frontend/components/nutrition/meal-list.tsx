// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import type { Meal } from "@/lib/store"

// interface MealListProps {
//   meals: Meal[]
// }

// export function MealList({ meals }: MealListProps) {
//   const mealTypeEmojis: Record<string, string> = {
//     breakfast: "🌅",
//     lunch: "🍽️",
//     dinner: "🌙",
//     snack: "🥜",
//     pre_workout: "⚡",
//     post_workout: "💪",
//   }

//   return (
//     <div className="space-y-4">
//       {meals.map((meal, i) => (
//         <Card key={i}>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">{mealTypeEmojis[meal.type] || "🍴"}</span>
//                 <div>
//                   <h3 className="font-bold capitalize">{meal.type.replace("_", " ")}</h3>
//                   <p className="text-muted-foreground text-sm">{meal.name}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg">{meal.totals.calories}</p>
//                 <p className="text-muted-foreground text-xs">calories</p>
//               </div>
//             </div>

//             <div className="space-y-2 mb-4">
//               {meal.items.map((item, j) => (
//                 <div key={j} className="flex justify-between text-sm p-2 bg-accent/10 rounded">
//                   <span>{item.name}</span>
//                   <span className="text-muted-foreground">{item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
//               <div>
//                 <p className="text-muted-foreground text-xs">Protein</p>
//                 <p className="font-semibold">{meal.totals.protein}g</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground text-xs">Carbs</p>
//                 <p className="font-semibold">{meal.totals.carbs}g</p>
//               </div>
//               <div>
//                 <p className="text-muted-foreground text-xs">Fats</p>
//                 <p className="font-semibold">{meal.totals.fats}g</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }



"use client"

import { Card, CardContent } from "@/components/ui/card"

interface MealSlot {
  dish_name: string
  ingredients: string
  approx_calories: number
  approx_macros: number
  approx_carbs: number
  approx_fat: number
  portion_size: string
}

interface MealListProps {
  meals: {
    breakfast?: MealSlot
    lunch?: MealSlot
    dinner?: MealSlot
    pre_workout?: MealSlot
    post_workout?: MealSlot
  }
}

const mealTypeEmojis: Record<string, string> = {
  breakfast: "🌅",
  lunch: "🍽️",
  dinner: "🌙",
  pre_workout: "⚡",
  post_workout: "💪",
}

export function MealList({ meals }: MealListProps) {
  return (
    <div className="space-y-4">
      {Object.entries(meals).map(([type, meal]) => {
        if (!meal) return null

        return (
          <Card key={type}>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {mealTypeEmojis[type] || "🍴"}
                </span>
                <div>
                  <h3 className="font-bold capitalize">
                    {type.replace("_", " ")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {meal.dish_name}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {meal.ingredients}
              </p>

              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-xs">Calories</p>
                  <p className="font-semibold">{meal.approx_calories}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Protein</p>
                  <p className="font-semibold">{meal.approx_macros}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Carbs</p>
                  <p className="font-semibold">{meal.approx_carbs}g</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fats</p>
                  <p className="font-semibold">{meal.approx_fat}g</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Portion: {meal.portion_size}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
