import { format, parseISO } from 'date-fns';
import { Tooltip, XAxis, LineChart, Line, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { CustomToolTip } from './custom-tooltip';

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(parseISO(value), 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <YAxis tickLine={false} />
        <Tooltip content={<CustomToolTip />} />
        
        {/* Line for Income */}
        <Line
          type="monotone"
          dataKey="income"
          stroke="#3d82f6"
          strokeWidth={2}
          className=' drop-shadow-sm'
          dot={false} // Disables dots on the line
          activeDot={{ r: 6 }} // Active dot with a larger radius when hovered
        />

        {/* Line for Expenses */}
        <Line
              className=' drop-shadow-sm'
          type="monotone"
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={false} // Disables dots on the line
          activeDot={{ r: 6 }} // Active dot with a larger radius when hovered
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
