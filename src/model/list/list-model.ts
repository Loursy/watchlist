import mongoose from 'mongoose'
import { IListDocument } from './list-interface'
import { listSchema } from './list-schema'

const List = mongoose.model<IListDocument>('List', listSchema)
export default List
