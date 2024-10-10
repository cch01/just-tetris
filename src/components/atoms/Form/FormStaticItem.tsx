interface FormStaticItemProps {
  description: string
  value: string
}
export const FormStaticItem: React.FC<FormStaticItemProps> = ({
  description,
  value
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-base text-secondary">{description}</div>
      <div className="text-base font-semibold text-secondary">$ {value}</div>
    </div>
  )
}
