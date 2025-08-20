import mongoose from 'mongoose'
import { IMovieDocument } from './movie-interface'
import { movieSchema } from './movie-schema'

const Movie = mongoose.model<IMovieDocument>('Movie', movieSchema)
export default Movie;