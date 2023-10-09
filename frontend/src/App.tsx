import React, { useState } from 'react'
import Select from 'react-select'
import DryFoods from './dry-food.json'
import ActivityAmounts from './activity-amount.json'
import MinNutritionRatio from './min-nutrition-ratio.json'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart'
    }
  }
}

const labels = ['カロリー(kcal)', 'たんぱく質(g)', '脂質(g)']

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: '1日に必要な量',
//       data: [displayDER(), 42, 117.5],
//       backgroundColor: 'rgba(255, 99, 132, 0.5)'
//     },
//     {
//       label: '1日の摂取量',
//       data: [52.3, 56.1, 117.5],
//       backgroundColor: 'rgba(53, 162, 235, 0.5)'
//     }
//   ]
// }

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
  interface MinNutritionRatioProps {
    protein: number
    fat: number
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
  const minNutritionRatio: MinNutritionRatioProps = MinNutritionRatio
  const [food, setFood] = useState<FoodProps | null>(null)
  const [actAmount, setActAmount] = useState<ActivityAmountProps | null>(null)
  const [weight, setWeight] = useState<number>(0)
  const [DER, setDER] = useState<number>(0)
  const [foodWeight, setFoodWeight] = useState(0)

  const displayDER: string = () => {
    return DER.toFixed(1) + 'kcal'
  }

  const displayNeedProteinWeight: string = () => {
    if (!(DER > 0)) {
      return '0g'
    }
    return (DER * minNutritionRatio.protein / 100).toFixed(1) + 'g'
  }

  const displayNeedFatWeight: string = () => {
    if (!(DER > 0)) {
      return '0g'
    }
    return (DER * minNutritionRatio.fat / 100).toFixed(1) + 'g'
  }
  const displayIntakeProteinWeight: string = () => {
    if (food === null) {
      return '0g'
    }
    return (food.protein * foodWeight / 100).toFixed(1) + 'g'
  }
  const displayIntakeFatWeight: string = () => {
    if (food === null) {
      return '0g'
    }
    return (food.fat * foodWeight / 100).toFixed(1) + 'g'
  }
  const displayIntakeCal: string = () => {
    if (food === null) {
      return '0kcal'
    }
    return (food.calories * foodWeight / 100).toFixed(1) + 'kcal'
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
  const data = {
    labels,
    datasets: [
      {
        label: '1日に必要な量',
        data: [displayDER(), displayNeedProteinWeight(), displayNeedFatWeight()],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: '1日の摂取量',
        data: [displayIntakeCal(), displayIntakeProteinWeight(), displayIntakeFatWeight()],
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
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
      <label>1日に必要なたんぱく質：</label>
      <input
        value={displayNeedProteinWeight()}
        type="text"
        disabled
      />
      <label>1日に必要な脂質：</label>
      <input
        value={displayNeedFatWeight()}
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
      <label>1日のフード量(g)：</label>
      <input
        value={foodWeight}
        type="number"
        step="0.1"
        onChange={(e: HTMLElement) => {
          if (e.target.valueAsNumber < 0) {
            return
          }
          setFoodWeight(e.target.valueAsNumber)
        }
        }
      />
        <label>含まれているカロリー：</label>
      <input
        value={displayIntakeCal()}
        type="text"
        disabled
      />
      <label>含まれているたんぱく質：</label>
      <input
        value={displayIntakeProteinWeight()}
        type="text"
        disabled
      />
      <label>含まれている脂肪：</label>
      <input
        value={displayIntakeFatWeight()}
        type="text"
        disabled
      />
      <input type="button" value="計算する" onClick={handleClick} />
      <Bar options={options} data={data} />
    </div>
  )
}
