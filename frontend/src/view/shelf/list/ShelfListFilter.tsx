import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { i18n } from 'src/i18n';
import actions from 'src/modules/shelf/list/shelfListActions';
import selectors from 'src/modules/shelf/list/shelfListSelectors';
import yupFilterSchemas from 'src/modules/shared/yup/yupFilterSchemas';
import FilterWrapper, {
  FilterButtons,
} from 'src/view/shared/styles/FilterWrapper';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import filterRenders from 'src/modules/shared/filter/filterRenders';
import FilterPreview from 'src/view/shared/filter/FilterPreview';
import FilterAccordion from 'src/view/shared/filter/FilterAccordion';
import InputFormItem from 'src/view/shared/form/items/InputFormItem';
import ShopAutocompleteFormItem from 'src/view/shop/autocomplete/ShopAutocompleteFormItem';
import DepartmentAutocompleteFormItem from 'src/view/department/autocomplete/DepartmentAutocompleteFormItem';
import SectionAutocompleteFormItem from 'src/view/section/autocomplete/SectionAutocompleteFormItem';
import MDButton from 'src/mui/components/MDButton';
import { selectMuiSettings } from 'src/modules/mui/muiSelectors';

const schema = yup.object().shape({
  name: yupFilterSchemas.string(
    i18n('entities.shelf.fields.name'),
  ),
  shop: yupFilterSchemas.relationToOne(
    i18n('entities.shelf.fields.shop'),
  ),
  department: yupFilterSchemas.relationToOne(
    i18n('entities.shelf.fields.department'),
  ),
  section: yupFilterSchemas.relationToOne(
    i18n('entities.shelf.fields.section'),
  ),
});

const emptyValues = {
  name: null,
  shop: null,
  department: null,
  section: null,
};

const previewRenders = {
  name: {
    label: i18n('entities.shelf.fields.name'),
    render: filterRenders.generic(),
  },
  shop: {
    label: i18n('entities.shelf.fields.shop'),
    render: filterRenders.relationToOne(),
  },
  department: {
    label: i18n('entities.shelf.fields.department'),
    render: filterRenders.relationToOne(),
  },
  section: {
    label: i18n('entities.shelf.fields.section'),
    render: filterRenders.relationToOne(),
  },
};

function ShelfListFilter(props) {
  const { sidenavColor } = selectMuiSettings();
  const rawFilter = useSelector(selectors.selectRawFilter);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const [initialValues] = useState(() => {
    return {
      ...emptyValues,
      ...rawFilter,
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    dispatch(
      actions.doFetch(
        schema.cast(initialValues),
        rawFilter,
      ),
    );
    // eslint-disable-next-line
  }, [dispatch]);

  const onSubmit = (values) => {
    const rawValues = form.getValues();
    dispatch(actions.doFetch(values, rawValues));
    setExpanded(false);
  };

  const onReset = () => {
    Object.keys(emptyValues).forEach((key) => {
      form.setValue(key, emptyValues[key]);
    });
    dispatch(actions.doReset());
    setExpanded(false);
  };

  const onRemove = (key) => {
    form.setValue(key, emptyValues[key]);
    return form.handleSubmit(onSubmit)();
  };

  return (
    <FilterWrapper>
      <FilterAccordion
        expanded={expanded}
        onChange={(event, isExpanded) =>
          setExpanded(isExpanded)
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
        >
          <FilterPreview
            values={rawFilter}
            renders={previewRenders}
            expanded={expanded}
            onRemove={onRemove}
          />
        </AccordionSummary>
        <AccordionDetails>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item lg={6} xs={12}>
                  <InputFormItem
                    name="name"
                    label={i18n(
                      'entities.shelf.fields.name',
                    )}
                    variant="standard"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <ShopAutocompleteFormItem
                    name="shop"
                    label={i18n(
                      'entities.shelf.fields.shop',
                    )}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <DepartmentAutocompleteFormItem
                    name="department"
                    label={i18n(
                      'entities.shelf.fields.department',
                    )}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <SectionAutocompleteFormItem
                    name="section"
                    label={i18n(
                      'entities.shelf.fields.section',
                    )}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <FilterButtons>
                <MDButton
                  variant="gradient"
                  color={sidenavColor}
                  type="submit"
                  disabled={props.loading}
                  startIcon={<SearchIcon />}
                  size="small"
                >
                  {i18n('common.search')}
                </MDButton>

                <MDButton
                  variant="outlined"
                  color={sidenavColor}
                  type="button"
                  onClick={onReset}
                  disabled={props.loading}
                  startIcon={<UndoIcon />}
                  size="small"
                >
                  {i18n('common.reset')}
                </MDButton>
              </FilterButtons>
            </form>
          </FormProvider>
        </AccordionDetails>
      </FilterAccordion>
    </FilterWrapper>
  );
}

export default ShelfListFilter;
