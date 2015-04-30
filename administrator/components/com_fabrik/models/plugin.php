<?php
/**
 * Fabrik Admin Plugin Model
 *
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005-2015 fabrikar.com - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 * @since       1.6
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

interface FabrikAdminModelPluginInterface
{
	/**
	 * Render the initial plugin options, such as the plugin selector, and whether its rendered in front/back/both etc
	 *
	 * @return  string
	 */
	public function top();
}

/**
 * Fabrik Admin Plugin Model
 * Used for loading via ajax form plugins
 *
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @since       3.0.6
 */
abstract class FabrikAdminModelPlugin extends FabModelAdmin implements FabrikAdminModelPluginInterface
{
	/**
	 * Render the plugins fields
	 *
	 * @return string
	 */
	public function render()
	{
		$input = $this->input;
		$pluginManager = JModelLegacy::getInstance('Pluginmanager', 'FabrikFEModel');
		$plugin = $pluginManager->getPlugIn($this->getState('plugin'), $this->getState('type'));
		$feModel = $this->getPluginModel();
		$plugin->getJForm()->model = $feModel;

		$data = $this->getData();
		$input->set('view', $this->getState('type'));

		$str = $plugin->onRenderAdminSettings($data, $this->getState('c'), 'nav-tabs');
		$input->set('view', 'plugin');

		return $str;
	}

	/**
	 * Get the plugin model
	 *
	 * @return  object
	 */
	protected function getPluginModel()
	{
		$feModel = null;
		$type = $this->getState('type');

		if ($type === 'elementjavascript')
		{
			return null;
		}

		if ($type !== 'validationrule')
		{
			// Set the parent model e.g. form/list
			$feModel = JModelLegacy::getInstance($type, 'FabrikFEModel');
			$feModel->setId($this->getState('id'));
		}

		return $feModel;
	}

}
