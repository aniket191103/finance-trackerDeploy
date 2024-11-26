import { formatPercentage } from "@/lib/utils";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryToolTip } from "./category-tooltip";

// Define your color palette for pie slices
const colors = ["#0062FF", "#12C6FF", "#FF647F", "#FF9354"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const PieVariant = ({ data = [] }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend 
        layout="horizontal" verticalAlign="bottom" align="right" iconType="circle"
        content={({payload}:any)=>{
            return (
                <ul className=" flex flex-col space-y-2 ">
                    {payload.map((entry :any,index:number)=>(
                        <li key={`item - ${index}`} className=" flex items-center space-x-2"> 
                        <span  
                        className=" size-2 rounded-full" style={{backgroundColor:entry.color}}
                        />
                        <div className=" space-x-1 ">
                            <span className=" text-sm to-muted-foreground">
                                    {entry.value}
                            </span>
                            <span className="text-sm "> 
                        {formatPercentage(entry.payload.percent *100)}
                            </span>

                        </div>
                        </li>
                    ))}
                </ul>
            )
        }}
        />
        <Tooltip 
          content={<CategoryToolTip/>}
        />
        <Pie
          data={data}
          dataKey="value"
            cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#8884d8"
          labelLine={false}
        >
          {/* Apply colors to each pie slice */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {/* Tooltip to show detailed information on hover */}
        
        {/* Legend to display chart labels */}
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
