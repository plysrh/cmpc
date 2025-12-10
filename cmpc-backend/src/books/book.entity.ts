import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'books', paranoid: true })
export class Book extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare titulo: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare autor: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare editorial: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare precio: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare disponibilidad: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  declare genero: string;
}
