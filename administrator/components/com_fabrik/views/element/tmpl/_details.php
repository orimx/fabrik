<?php
/**
 * Admin Element Edit - Details Tmpl
 *
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005-2015 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 * @since       3.0
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

use Fabrik\Helpers\Text;

?>
<div class="tab-pane active" id="tab-details">
	<fieldset class="form-horizontal">
		<legend><?php echo Text::_('COM_FABRIK_DETAILS');?></legend>
		<input type="hidden" id="name_orig" name="name_orig" value="<?php echo $this->item->name; ?>" />
		<input type="hidden" id="plugin_orig" name="plugin_orig" value="<?php echo $this->item->plugin; ?>" />

		<div class="span10">
		<?php
		foreach ($this->form->getFieldset('details') as $this->field) :
			require '_control_group.php';
		endforeach;

		foreach ($this->form->getFieldset('details2') as $this->field) :
			require '_control_group.php';
		endforeach;
		?>
		</div>

	</fieldset>

	<fieldset class="form-horizontal">
		<div id="plugin-container">
		<?php echo $this->pluginFields; ?>
		</div>
	</fieldset>
</div>