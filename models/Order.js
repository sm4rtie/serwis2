var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Employee Model
 * ==========
 */
var Order = new keystone.List('Order');

Order.add({
  client: {type: Types.Relationship, ref: 'User', refPath: '_id', many: false, filters: { isEmployee: false }},
	dateStart: { type: Date, default: Date.now },
	//product: { type: Types.Name, required: true},
  employee: {type: Types.Relationship, ref: 'User', refPath: '_id', many: false, required: true, filters: { isEmployee: true }, initial: false},
  state: { type: Types.Select, options: 'Przyjete do realizacji, W realizacji, Ukonczono, Odebrano', default: 'Przyjete do realizacji' },
  dateEnd: {type: Date, required: false},
  product: {type: String},
  comment: {type: Types.Textarea, default: 'n/c'}
});
Order.defaultSort = ('-dateStart');
Order.register();
