import React, { useState } from 'react'
import Select from 'react-select'
import DryFoods from './dry-food.json'
import ActivityAmounts from './activity-amount.json'

// https://zenn.dev/waddy/articles/react-select-customize
// https://qiita.com/yhakiai/items/5f5e50c302ca2300d2b9
// https://www.servernote.net/article.cgi?id=javascript-find-filter-in-jsonarray
// https://maku.blog/p/x3ocp9a/
// https://chaika.hatenablog.com/entry/2020/08/16/083000
// https://zenn.dev/nana/articles/4f170f730f2358

export default function App (): JSX.Element {
  interface FoodProps {
    id: number
    name: string | null
    protein: number | null
    carbohydrates: number | null
    fat: number | null
    fiber: number | null
    moisture: number | null
    P: number | null
    calories: number | null
  }
  interface ActivityAmountProps {
    id: number
    name: string
    coefficient: number
  }
  interface Option {
    label: string
    value: number
  }

  const Props2Option = (args: any): Option => {
    return {
      label: args.name,
      value: args.id
    }
  }

  const foods: FoodProps[] = DryFoods
  const activityAmounts: ActivityAmountProps[] = ActivityAmounts
  const [food, setFood] = useState<FoodProps | null>(null)
  const [actAmount, setActAmount] = useState<ActivityAmountProps | null>(null)
  const [weight, setWeight] = useState<number>(0)
  const [DER, setDER] = useState<number>(0)
  const displayDER: string = () => {
    return DER.toFixed(1) + 'kcal'
  }

  const handleClick = (): void => {
    if (actAmount !== null) {
      const RER = 70 * (weight ** (3 / 4))
      setDER(actAmount.coefficient * RER)
    }
  }

  const CalcDER = (weight: number, actCoefficient: number): number => {
    if (isNaN(weight)) {
      return 0
    }
    const RER = 70 * (weight ** (3 / 4))
    return actCoefficient * RER
  }

  return (
    <div className="App">
      <label>体重(kg)：</label>
      <input
        value={weight}
        type="number"
        step="0.1"
        onChange={(e: HTMLElement) => {
          if (e.target.valueAsNumber < 0) {
            return
          }
          setWeight(e.target.valueAsNumber)
          if (actAmount !== null) {
            setDER(CalcDER(e.target.valueAsNumber, actAmount.coefficient))
          }
        }}
      />
      <label>1日に必要なカロリー：</label>
      <input
        value={displayDER()}
        type="text"
        disabled
      />
      <Select
        options={activityAmounts.map(Props2Option)}
        onChange={(e: number) => {
          const selectedAct = activityAmounts.find((v: ActivityAmountProps) => v.id === e.value)
          if (selectedAct === undefined || isNaN(weight)) {
            return
          }
          setActAmount(selectedAct)
          setDER(CalcDER(weight, selectedAct.coefficient))
        }
        }
      />
      <Select
        options={foods.map(Props2Option)}
        onChange={(e: number) => {
          const selectedFood = foods.find((v: FoodProps) => v.id === e.value)
          if (selectedFood !== undefined) {
            setFood(selectedFood)
          }
        }}
      />
      <input type="button" value="計算する" onClick={handleClick} />
    </div>
  )
}
