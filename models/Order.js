var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Employee Model
 * ==========
 */
var Order = new keystone.List('Order');

Order.add({
  client: {type: Types.Relationship, ref: 'User', refPath: '_id', many: false, filters: { isEmployee: false }, initial: true},
	dateStart: { type: Date, default: Date.now },
	//product: { type: Types.Name, required: true},
  employee: {type: Types.Relationship, ref: 'User', refPath: '_id', many: false, required: false, filters: { isEmployee: true }, initial: true},
  state: { type: Types.Select, required: false, options: 'Admitted, In realization, Finished', default: 'Admitted', initial: true },
  dateEnd: {type: Date, required: false},
  product: {type: String, initial: true},
  damage: {type: Types.Textarea, default: 'n/c', initial: true}
});
Order.schema.virtual('url').get(function() {
  return '/manage/orders/' + this.id;
});

Order.defaultSort = ('-dateStart');
Order.register();
