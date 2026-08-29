import mongoose from 'mongoose';

/**
 * validateObjectId
 *
 * Express middleware that rejects requests whose `:id` route parameter is not
 * a valid MongoDB ObjectId before the request reaches any DB call.
 *
 * Without this guard, Mongoose throws a CastError (unhandled) that either:
 *   a) Surfaces as a 500 with a leaky error message, or
 *   b) Bypasses ownership checks because the invalid ID never matches anything
 *      (low-severity but produces confusing 500s instead of clean 400s).
 *
 * Usage (in any route file):
 *   import { validateObjectId } from '../middleware/validateObjectId.js';
 *   router.get('/:id', validateObjectId, myController);
 *
 * Can also be applied per-param at the router level:
 *   router.param('id', validateObjectId);  // NOT used here — explicit is cleaner
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(); // no :id param on this route — pass through

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: `'${id}' is not a valid resource ID`,
    });
  }

  next();
};
