var Block = W.Class('Block', null, {
	Block: function(block, product) {
		this.block = block;
		this.product= product;
		this.vars = W.extend(Object.create(product.vars), { block: block })
	},
	
	data: function(value){
		var block = this.block;
		if (arguments.length == 0) {
			return block.data();
		} else {
			if(value.count){
				block.node.find('.tip').css('visibility','inherit');
			}
			block.data(value, this.vars);
		}
	}
});

widget.Product = W.Class('Product', widget.Base, {
	Product: function(W, render_context) {
		this.Base(W, render_context);
		this.vars = W.extend(Object.create(W.layout.vars), { product: this });
	},
	
	options_attr_name: 'data-product-block',
	
	mixin_name: 'product-block',
	
	add_block:function(block_data){
		var W = this.W, self=this;
		var block_node = W.clone(this.block_def);
		var block = new Block(W.$(block_node), this);
		
		$(this.node).append(block_node);
		
		this.render(block_node, { vars: block.vars }).done(function() {
			block.data(block_data);
		});
	},	
	
	_render:function(){
		var W = this.W, self = this, elem = $(this.node);
		
		this.block_def = elem.children('.w-product').detach();
		//================Getter & Setter=================
		W.data_getter(this.node, function() {
			//TODO 
		});
		
		W.data_setter(this.node, function(data) {
			elem.empty();
			if(data){
				for (var i = 0; i < data.length; i++) {
					self.add_block(data[i]);
				}
			}
		});
	}
});

W.define_widget({
	name: 'product',
	description: '产品块',
	selector: 'div.w-product-block',
	onrender: function(node, render_context) {
		var W = this;

		var product = new widget.Product(W.$(node), render_context);
		product.render();
	}
});