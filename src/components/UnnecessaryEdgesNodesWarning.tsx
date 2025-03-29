import { Popover, PopoverContent, Portal, PopoverHeader, useTheme } from '@chakra-ui/react';

import { LevelsProgressionContext } from './providers/LevelsProgressionProvider';
import { CustomTheme } from '@/types';

export const UnnecessaryEdgesNodesWarning: React.FC = () => {
  const [anyInvalidEdgesOrNodes, sidePanelOpen] = LevelsProgressionContext().useSelector(state => [
    state.context.show_unncessary_edges_or_nodes_warning,
    state.context.side_panel_open,
  ]);

  const theme = useTheme<CustomTheme>();
  const topPos = theme.sizes.navbarHeightInPixels + 10;
  const rightPos = sidePanelOpen ? theme.sizes.sidePanelWidthInPixels + 10 : 10;

  return (
    <Portal>
      <Popover isOpen={anyInvalidEdgesOrNodes}>
        <PopoverContent position='fixed' top={`${topPos}px`} right={`${rightPos}px`} w='auto'>
          <PopoverHeader fontWeight='semibold' fontSize='16px' color={theme.colors.red[700]}>
            You Have Unnecessary Edges or Nodes In The Canvas
            <br />
            Delete them by clicking on the edge/node and press the delete key
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </Portal>
  );
};
