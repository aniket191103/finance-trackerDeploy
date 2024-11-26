import { format, parseISO } from 'date-fns';
import { Tooltip, XAxis, BarChart, Bar, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { CustomToolTip } from './custom-tooltip';

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(parseISO(value), 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        {/* <YAxis tickLine={false} /> */}
        <Tooltip content={<CustomToolTip />} />
        
        {/* Bar for Income */}
        <Bar
          dataKey="income"
          fill="#3d82f6"
          className=' drop-shadow-sm'
          radius={[4, 4, 0, 0]} // Rounded top corners for the bars
          barSize={30}
        />

        {/* Bar for Expenses */}
        <Bar
          dataKey="expenses"
          fill="#f43f5e"
           className=' drop-shadow-sm'
          radius={[4, 4, 0, 0]} // Rounded top corners for the bars
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
